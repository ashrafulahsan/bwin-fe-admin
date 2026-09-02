"use client";

import { useAppStore } from "@/store/appStore";
import { useProfile } from "../hooks";
import ProfileCard from "./ProfileCard";
import ProfileDetailsTab from "./ProfileDetailsTab";
import ProfileActivitiesTab from "./ProfileActivitiesTab";
import ProfilePasswordTab from "./ProfilePasswordTab";

export default function ProfilePage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const p = useProfile();

  const gridColumns = isMobile ? "minmax(0,1fr)" : "minmax(280px,340px) minmax(0,1fr)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: gridColumns, gap: 20, alignItems: "start", fontFamily: "var(--font-body)" }}>
      <ProfileCard
        profile={p.profile}
        roleLabel={p.roleLabel}
        basicFields={p.basicFields}
        bioField={p.bioField}
        avatarSrc={p.avatarSrc}
        hasCustomAvatar={p.hasCustomAvatar}
        avatarHint={p.avatarHint}
        onAvatarFile={p.onAvatarFile}
        removeAvatar={p.removeAvatar}
        editBasic={p.editBasic}
        savingBasic={p.savingBasic}
        savedBasic={p.savedBasic}
        startEditBasic={p.startEditBasic}
        saveBasic={p.saveBasic}
        cancelBasic={p.cancelBasic}
      />

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 2, padding: "0 8px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {p.profileTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={tab.onClick}
              style={{
                padding: "14px 18px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-body-md)",
                fontWeight: tab.active ? "var(--fw-medium)" : "var(--fw-regular)",
                color: tab.active ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: `2px solid ${tab.active ? "var(--orange-500)" : "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {p.profileTab === "details" && (
          <ProfileDetailsTab
            detailGroups={p.detailGroups}
            editDetails={p.editDetails}
            savingDetails={p.savingDetails}
            savedDetails={p.savedDetails}
            startEditDetails={p.startEditDetails}
            saveDetails={p.saveDetails}
            cancelDetails={p.cancelDetails}
          />
        )}
        {p.profileTab === "activities" && (
          <ProfileActivitiesTab
            activities={p.profileActivities}
            loading={p.activitiesLoading}
            empty={p.noActivities}
          />
        )}
        {p.profileTab === "password" && <ProfilePasswordTab />}
      </div>
    </div>
  );
}
