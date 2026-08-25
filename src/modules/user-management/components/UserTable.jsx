"use client";

import { Avatar, Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";
import { LANGUAGES, USER_STATUS_TONES } from "../constants/users.mock";

const GRID_COLUMNS = "1.6fr 1.5fr 1.1fr 0.8fr 1fr 1fr 132px";

const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function UserTable({ rows, roleNamesOf, noResults, darkMode, onView, onEdit, onToggleStatus, onToggleDeleted }) {
  const neutralStyle = darkBadgeStyle("neutral", darkMode);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1120 }}>
        <div style={headerCellStyle}>Name</div>
        <div style={headerCellStyle}>Email / phone</div>
        <div style={headerCellStyle}>Roles</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Last login</div>
        <div style={headerCellStyle}>Created</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((user) => {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
        const provider = user.is_social_login ? `${user.social_provider} sign-in` : "password sign-in";
        const metaLine = `${LANGUAGES[user.language] || user.language} · ${provider}`;
        const tone = USER_STATUS_TONES[user.status] || "neutral";
        const isDeleted = !!user.deleted_at;

        return (
          <div
            key={user.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1120,
              background: isDeleted ? "var(--surface-sunken)" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <Avatar name={fullName} size={32} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {fullName}
                </div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{metaLine}</div>
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email || "—"}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{user.phone || "—"}</div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {roleNamesOf(user).map((name) => (
                <Badge key={name} tone="neutral" style={neutralStyle}>
                  {name}
                </Badge>
              ))}
            </div>

            <div>
              <Badge tone={tone} style={darkBadgeStyle(tone, darkMode)}>
                {user.status}
              </Badge>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {user.last_login_at ? user.last_login_at.slice(0, 10) : "never"}
            </div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{user.created_at}</div>

            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <RowActionButton title="View" icon={<Icon name="eye" size={15} />} onClick={() => onView(user.id)} />
              <RowActionButton title="Edit" icon={<Icon name="pencil-square" size={15} />} onClick={() => onEdit(user.id)} />
              <RowActionButton
                title={user.status === "active" ? "Suspend" : "Activate"}
                icon={<Icon name={user.status === "active" ? "pause" : "play"} size={15} />}
                onClick={() => onToggleStatus(user.id)}
              />
              {isDeleted ? (
                <RowActionButton
                  title="Restore"
                  icon={<Icon name="arrow-uturn-left" size={15} />}
                  onClick={() => onToggleDeleted(user.id)}
                />
              ) : (
                <RowActionButton
                  title="Delete"
                  danger
                  icon={<Icon name="trash" size={15} style={{ color: "var(--state-error)" }} />}
                  onClick={() => onToggleDeleted(user.id)}
                />
              )}
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No users match these filters — try clearing the search.
        </div>
      )}
    </div>
  );
}
