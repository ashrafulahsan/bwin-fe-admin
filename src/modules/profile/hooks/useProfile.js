"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useCurrentUser } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { ADMIN_PROFILE, BASIC_FIELDS, PROFILE_GROUPS, PROFILE_ACTIVITIES } from "../constants/adminProfile.mock";

// Basic info has no mock fallback — it's either the real value from
// GET /auth/me or blank. designation/department have no backend source at
// all yet, so they stay blank everywhere (including the Professional detail
// group, which shares these same keys).
const BLANK_BASIC = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  avatar_url: "",
  bio: "",
  language: "",
  designation: "",
  department: "",
};

const LANGUAGE_LABELS = { en: "English", bn: "বাংলা" };

const FAMILIES = {
  navy: { light: ["var(--navy-100)", "var(--navy-700)"], dark: ["var(--navy-600)", "var(--navy-100)"] },
  orange: { light: ["var(--orange-100)", "var(--orange-600)"], dark: ["var(--orange-900)", "var(--orange-200)"] },
  tan: { light: ["var(--tan-100)", "var(--tan-600)"], dark: ["var(--tan-800)", "var(--tan-100)"] },
  neutral: { light: ["var(--gray-100)", "var(--gray-600)"], dark: ["var(--gray-700)", "var(--gray-200)"] },
};

export function useProfile() {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const { showError } = useToast();
  // Basic info (name/email/phone/avatar/bio/language/role) comes from
  // GET /auth/me; everything else in ADMIN_PROFILE (address, education, ...)
  // stays mock — the backend has no profile table for it yet.
  const { data: currentUser, isError: currentUserFailed } = useCurrentUser();
  const [profileFields, setProfileFields] = useState({ ...ADMIN_PROFILE, ...BLANK_BASIC });
  const [roleLabel, setRoleLabel] = useState("—");
  const [profileTab, setProfileTab] = useState("details");
  const [editBasic, setEditBasic] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [savedFlash, setSavedFlash] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    // Seeding the editable draft from the fetched record, once, when it
    // arrives — not deriving render output, so the effect is warranted here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileFields((prev) => ({
      ...prev,
      first_name: currentUser.first_name || "",
      last_name: currentUser.last_name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      avatar_url: currentUser.avatar_url || "",
      bio: currentUser.bio || "",
      language: LANGUAGE_LABELS[currentUser.language] || currentUser.language || "",
    }));
    setRoleLabel(currentUser.roles?.[0]?.name || "—");
  }, [currentUser]);

  useEffect(() => {
    if (currentUserFailed) showError("Couldn't load your profile from the server.");
  }, [currentUserFailed, showError]);

  const fam = (name) => {
    const [bg, color] = FAMILIES[name][darkMode ? "dark" : "light"];
    return { bg, color };
  };

  const setField = (key) => (e) => setProfileFields((prev) => ({ ...prev, [key]: e.target.value }));

  const pf = profileFields;

  const basicFields = BASIC_FIELDS.map((f) => ({ ...f, value: pf[f.key] || "", onChange: setField(f.key) }));

  const detailGroups = PROFILE_GROUPS.map((g) => ({
    title: g.title,
    fields: g.fields.map(([key, label]) => ({ key, label, value: pf[key] || "—", editValue: pf[key] || "", onChange: setField(key) })),
  }));

  const profileActivities = PROFILE_ACTIVITIES.map((r) => ({
    action: r.action,
    module: r.module,
    timestamp: r.created_at,
    ip: r.ip_address,
    icon: r.icon,
    ...fam(r.tone),
  }));

  const hasCustomAvatar = !!pf.avatar_url;

  const onAvatarFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarFileName(file.name);
    setProfileFields((prev) => ({ ...prev, avatar_url: url }));
  };

  const removeAvatar = () => {
    setAvatarFileName(null);
    setProfileFields((prev) => ({ ...prev, avatar_url: "" }));
  };

  const startEditBasic = () => {
    setEditBasic(true);
    setSnapshot({ ...profileFields });
    setSavedFlash(null);
  };
  const startEditDetails = () => {
    setEditDetails(true);
    setSnapshot({ ...profileFields });
    setSavedFlash(null);
  };
  const saveBasic = () => {
    setEditBasic(false);
    setSnapshot(null);
    setSavedFlash("basic");
  };
  const saveDetails = () => {
    setEditDetails(false);
    setSnapshot(null);
    setSavedFlash("details");
  };
  const cancelBasic = () => {
    setEditBasic(false);
    if (snapshot) setProfileFields(snapshot);
    setSnapshot(null);
  };
  const cancelDetails = () => {
    setEditDetails(false);
    if (snapshot) setProfileFields(snapshot);
    setSnapshot(null);
  };

  const profileTabs = [
    { key: "details", label: "Details" },
    { key: "activities", label: "Activities" },
    { key: "password", label: "Password change" },
  ].map((t) => ({ ...t, active: profileTab === t.key, onClick: () => setProfileTab(t.key) }));

  return {
    profile: {
      fullName: `${pf.first_name || ""} ${pf.last_name || ""}`.trim(),
      subtitle: [pf.designation, pf.department].filter(Boolean).join(" · "),
      email: pf.email,
      phone: pf.phone,
      language: pf.language,
      bio: pf.bio,
    },
    roleLabel,
    basicFields,
    bioField: { value: pf.bio || "", onChange: setField("bio") },
    avatarSrc: pf.avatar_url || "",
    hasCustomAvatar,
    avatarHint: avatarFileName || "JPG or PNG, square, at least 400×400px",
    onAvatarFile,
    removeAvatar,

    detailGroups,
    profileActivities,
    profileTabs,
    profileTab,

    editBasic,
    editDetails,
    savedBasic: savedFlash === "basic",
    savedDetails: savedFlash === "details",
    startEditBasic,
    startEditDetails,
    saveBasic,
    saveDetails,
    cancelBasic,
    cancelDetails,
  };
}
