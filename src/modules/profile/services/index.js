import {
  changePasswordRequest,
  getMyActivityRequest,
  getMyDetailsRequest,
  updateMyDetailsRequest,
  updateMyProfileRequest,
} from "../api";

// Every backend response is wrapped in `{success, message, data}` — unwrap
// once here so hooks/components never touch the envelope.

// `data` is `null` (not a 404) when nothing has been filled in yet.
export async function getMyDetails() {
  const response = await getMyDetailsRequest();
  return response.data?.data ?? null;
}

export async function updateMyDetails(payload) {
  const response = await updateMyDetailsRequest(payload);
  return response.data?.data;
}

export async function updateMyProfile(payload) {
  const response = await updateMyProfileRequest(payload);
  return response.data?.data;
}

// A paginated `Page<ActivityLogSummary>`: `{items, meta}`.
export async function getMyActivity(params) {
  const response = await getMyActivityRequest(params);
  return response.data?.data ?? { items: [], meta: null };
}

// `{sessions_ended, tokens}` — `tokens` is null when other sessions were
// left alone (nothing needed replacing); otherwise it's the replacement
// pair, since the change retires every token the account held.
export async function changePassword(payload) {
  const response = await changePasswordRequest(payload);
  return response.data?.data;
}
