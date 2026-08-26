"use client";

import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { ADMIN_PROFILE, BASIC_FIELDS, PROFILE_GROUPS, PROFILE_ACTIVITIES } from "../constants/adminProfile.mock";

const DEFAULT_AVATAR = "uploads/admin-profile.png";

const FAMILIES = {
  navy: { light: ["var(--navy-100)", "var(--navy-700)"], dark: ["var(--navy-600)", "var(--navy-100)"] },
  orange: { light: ["var(--orange-100)", "var(--orange-600)"], dark: ["var(--orange-900)", "var(--orange-200)"] },
  tan: { light: ["var(--tan-100)", "var(--tan-600)"], dark: ["var(--tan-800)", "var(--tan-100)"] },
  neutral: { light: ["var(--gray-100)", "var(--gray-600)"], dark: ["var(--gray-700)", "var(--gray-200)"] },
};

export function useProfile() {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const [profileFields, setProfileFields] = useState({ ...ADMIN_PROFILE });
  const [profileTab, setProfileTab] = useState("details");
  const [editBasic, setEditBasic] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [savedFlash, setSavedFlash] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState(null);

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

  const hasCustomAvatar = !!pf.avatar_url && pf.avatar_url !== DEFAULT_AVATAR;

  const onAvatarFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarFileName(file.name);
    setProfileFields((prev) => ({ ...prev, avatar_url: url }));
  };

  const removeAvatar = () => {
    setAvatarFileName(null);
    setProfileFields((prev) => ({ ...prev, avatar_url: DEFAULT_AVATAR }));
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
      designation: pf.designation,
      department: pf.department,
      email: pf.email,
      phone: pf.phone,
      language: pf.language,
      bio: pf.bio,
    },
    roleLabel: "Super admin",
    basicFields,
    bioField: { value: pf.bio || "", onChange: setField("bio") },
    avatarSrc: hasCustomAvatar ? pf.avatar_url : DEFAULT_AVATAR,
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
