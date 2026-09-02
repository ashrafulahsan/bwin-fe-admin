"use client";

import { useRef } from "react";
import { Avatar, Button, Input, Textarea } from "@/components/ui";

export default function ProfileCard({
  profile,
  roleLabel,
  basicFields,
  bioField,
  avatarSrc,
  hasCustomAvatar,
  avatarHint,
  onAvatarFile,
  removeAvatar,
  editBasic,
  savedBasic,
  startEditBasic,
  saveBasic,
  cancelBasic,
}) {
  const fileInputRef = useRef(null);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "28px 24px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, borderBottom: "1px solid var(--border)" }}>
        <Avatar name={profile.fullName} src={hasCustomAvatar ? avatarSrc : undefined} size={112} style={{ fontSize: 40, border: "1px solid var(--border)" }} />
        {!editBasic && (
          <>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{profile.fullName}</div>
              {profile.subtitle && (
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{profile.subtitle}</div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{profile.email}</div>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{profile.phone}</div>
            </div>
          </>
        )}
      </div>

      {!editBasic && (
        <>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Bio</div>
            <p style={{ margin: 0, fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{profile.bio}</p>
          </div>
          <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 12, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>Language</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{profile.language}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>Role</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{roleLabel}</span>
            </div>
          </div>
          <div style={{ padding: "16px 24px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            {savedBasic && (
              <div style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--state-success-bg)", color: "var(--state-success)", fontSize: "var(--fs-body-sm)" }}>
                Basic information saved.
              </div>
            )}
            <Button variant="accent" style={{ width: "100%" }} onClick={startEditBasic}>
              Edit profile
            </Button>
          </div>
        </>
      )}

      {editBasic && (
        <div style={{ padding: "20px 24px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Profile picture</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={profile.fullName} src={hasCustomAvatar ? avatarSrc : undefined} size={56} style={{ border: "1px solid var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
                  >
                    Upload photo
                  </button>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", cursor: "pointer", whiteSpace: "nowrap" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Remove
                  </button>
                </div>
                <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{avatarHint}</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => onAvatarFile(e.target.files && e.target.files[0])} style={{ display: "none" }} />
          </div>

          {basicFields.map((bf) => (
            <div key={bf.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>{bf.label}</span>
              <Input value={bf.value} onChange={bf.onChange} />
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Bio</span>
            <Textarea value={bioField.value} onChange={bioField.onChange} rows={4} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="accent" onClick={saveBasic}>
              Save changes
            </Button>
            <Button variant="secondary" onClick={cancelBasic}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
