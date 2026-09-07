"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

// Camera-only concern: request permission, show a live preview, capture a
// still frame, let the caller retake or accept it. Knows nothing about
// uploads, profiles, or storage — it only ever hands back a `File` via
// `onCapture`, the same shape a <input type="file"> change event produces,
// so callers can feed it into whatever upload flow they already have.

const ERROR_MESSAGES = {
  NotAllowedError:
    "Camera permission was denied. Please allow camera access in your browser settings or choose an image from your device.",
  PermissionDeniedError:
    "Camera permission was denied. Please allow camera access in your browser settings or choose an image from your device.",
  NotFoundError: "Camera is not available on this device. Please choose an image from your device.",
  DevicesNotFoundError: "Camera is not available on this device. Please choose an image from your device.",
  OverconstrainedError: "Camera is not available on this device. Please choose an image from your device.",
  NotReadableError: "The camera could not be started. Please choose an image from your device.",
};

const UNSUPPORTED_MESSAGE =
  "Camera capture is not supported by this browser. Please choose an image from your device.";

const FALLBACK_MESSAGE = "Couldn't access the camera. Please choose an image from your device.";

export default function CameraCapture({ open, onCapture, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const capturedBlobRef = useRef(null);

  const [phase, setPhase] = useState("live"); // "live" | "captured"
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    setError(null);
    setPhase("live");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError(ERROR_MESSAGES[err?.name] || FALLBACK_MESSAGE);
    }
  }, []);

  // Opening the modal starts the camera; closing it (in any way — capture,
  // cancel, or the parent unmounting it) always stops every track.
  useEffect(() => {
    if (!open) return undefined;
    // Subscribing to the camera hardware, an external system — not deriving
    // render output — so the effect (and the setState inside startStream)
    // is warranted here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startStream();
    return () => stopStream();
  }, [open, startStream, stopStream]);

  useEffect(() => {
    if (open) return;
    // Resetting local UI state when the modal closes, not deriving render
    // output — the effect is warranted here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("live");
    setError(null);
    capturedBlobRef.current = null;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [open]);

  if (!open) return null;

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    // Crop to a centered square — the preferred shape for a profile photo.
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.getContext("2d").drawImage(video, sx, sy, size, size, 0, 0, size, size);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        capturedBlobRef.current = blob;
        setPreviewUrl(URL.createObjectURL(blob));
        setPhase("captured");
        // The still frame is already on the canvas — the live feed can stop now.
        stopStream();
      },
      "image/jpeg",
      0.92
    );
  };

  const handleRetake = () => {
    capturedBlobRef.current = null;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    startStream();
  };

  const handleUsePhoto = () => {
    if (!capturedBlobRef.current) return;
    onCapture(new File([capturedBlobRef.current], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" }));
  };

  const handleCancel = () => {
    stopStream();
    onCancel();
  };

  return (
    <div
      onClick={handleCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 420, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 17, color: "var(--text-primary)" }}>
          Take a photo
        </div>

        <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {error ? (
            <div style={{ padding: 20, fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6 }}>{error}</div>
          ) : phase === "captured" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Captured preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          {!error && phase === "captured" && (
            <>
              <Button variant="secondary" onClick={handleRetake}>
                Retake
              </Button>
              <Button onClick={handleUsePhoto}>Use photo</Button>
            </>
          )}
          {!error && phase === "live" && <Button onClick={handleCapture}>Capture</Button>}
        </div>
      </div>
    </div>
  );
}
