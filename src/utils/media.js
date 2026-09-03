import { API_BASE_URL } from "@/constants/constants";

// The backend stores media paths (avatar_url, ...) relative to its own
// origin rather than baking that origin into the stored value (so the same
// row still resolves correctly after a domain change, e.g. dev → staging).
// This is the one place that origin — derived from the same API base URL
// apiClient itself falls back to — is reattached for rendering.
const API_ORIGIN = (API_BASE_URL || "http://127.0.0.1:8000/api/v1").replace(/\/api\/v1\/?$/, "");

// Already-absolute values pass through untouched: a `blob:` URL (an
// unsaved local preview) or a full `http(s)://` URL (an S3-backed upload,
// which is absolute by nature — see app/modules/media/storage/s3.py).
export function resolveMediaUrl(path) {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
