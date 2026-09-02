"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, isUsableToken } from "@/constants/constants";
import { changePassword } from "../services";

const MIN_PASSWORD_LENGTH = 8;

export function usePasswordChange() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { showSuccess, showError } = useToast();

  const [current, setCurrentState] = useState("");
  const [next, setNextState] = useState("");
  const [confirm, setConfirmState] = useState("");
  const [signOutOtherSessions, setSignOutOtherSessions] = useState(true);
  const [formError, setFormError] = useState(null);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      // The change retires every token the account held, including the one
      // that made this request — swap to the replacement pair so this tab
      // stays signed in. `tokens` is null when other sessions were left
      // alone, since then there is nothing to replace.
      if (isUsableToken(data?.tokens?.access_token)) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.tokens.access_token);
        setAccessToken(data.tokens.access_token);
        if (isUsableToken(data.tokens.refresh_token)) {
          window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.tokens.refresh_token);
        }
      }

      setCurrentState("");
      setNextState("");
      setConfirmState("");
      setFormError(null);

      const ended = data?.sessions_ended || 0;
      showSuccess(
        ended > 0
          ? `Password changed. ${ended} session${ended === 1 ? "" : "s"} ended.`
          : "Password changed."
      );
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Couldn't change your password.";
      setFormError(message);
      showError(message);
    },
  });

  const submit = () => {
    setFormError(null);
    if (!current) {
      setFormError("Enter your current password.");
      return;
    }
    if (next.length < MIN_PASSWORD_LENGTH) {
      setFormError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (next !== confirm) {
      setFormError("New password and confirmation do not match.");
      return;
    }
    mutation.mutate({
      current_password: current,
      new_password: next,
      sign_out_other_sessions: signOutOtherSessions,
    });
  };

  const cancel = () => {
    setCurrentState("");
    setNextState("");
    setConfirmState("");
    setFormError(null);
  };

  return {
    current,
    onCurrentChange: (e) => setCurrentState(e.target.value),
    next,
    onNextChange: (e) => setNextState(e.target.value),
    confirm,
    onConfirmChange: (e) => setConfirmState(e.target.value),
    signOutOtherSessions,
    onSignOutOtherSessionsChange: (e) => setSignOutOtherSessions(e.target.checked),
    formError,
    submitting: mutation.isPending,
    submit,
    cancel,
  };
}
