"use client";

import { Badge, Button, Checkbox, Icon, Select, Textarea } from "@/components/ui";

export default function TicketDetailModal({
  detail,
  detailFields,
  replyDraft,
  onReplyChange,
  replyIsNote,
  onReplyNoteToggle,
  sendReply,
  statusChangeOptions,
  assigneeOptions,
  onDetailStatus,
  onDetailAssignee,
  escalateLabel,
  toggleEscalate,
  saveDetail,
  onClose,
}) {
  if (!detail) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 800, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{detail.subject}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {detail.ticket_no} · {detail.student_name} · {detail.created_at}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Badge tone={detail.priorityTone}>{detail.priorityLabel}</Badge>
          <Badge tone={detail.statusTone}>{detail.statusLabel}</Badge>
          {detail.is_escalated && <Badge tone="error">Escalated</Badge>}
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, flex: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontSize: 16, lineHeight: 1, cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-sunken)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px 20px" }}>
          {detailFields.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "18px 24px 0" }}>
          <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 6 }}>Description</div>
          <div style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", fontSize: "var(--fs-body-md)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {detail.description}
          </div>
        </div>

        {detail.hasAttachments && (
          <div style={{ padding: "16px 24px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {detail.attachmentChips.map((att, i) => (
              <span
                key={i}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", fontSize: "var(--fs-caption)", color: "var(--text-secondary)" }}
              >
                <Icon name="paper-clip" size={13} />
                {att.file_name} · {att.file_size}
              </span>
            ))}
          </div>
        )}

        <div style={{ padding: "18px 24px 0" }}>
          <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 8 }}>Conversation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
            {detail.thread.map((m, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: m.bg, border: `1px solid ${m.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{m.author}</span>
                  {m.isNote && <Badge tone="warning">Internal note</Badge>}
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{m.created_at}</span>
                </div>
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>{m.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Reply</span>
          <Textarea value={replyDraft} onChange={onReplyChange} rows={3} placeholder="Write a reply to the student, or check Internal note to log it privately" />
          <Checkbox
            checked={replyIsNote}
            onChange={onReplyNoteToggle}
            label="Internal note (not visible to student)"
            style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={sendReply}>
              Add to conversation
            </Button>
          </div>
        </div>

        <div style={{ padding: "18px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Change status</span>
            <Select value={detail.status} onChange={onDetailStatus} options={statusChangeOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Assigned to</span>
            <Select value={detail.assignedValue} onChange={onDetailAssignee} options={assigneeOptions} />
          </div>
        </div>

        <div style={{ padding: "18px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={toggleEscalate}>
            {escalateLabel}
          </Button>
          <Button onClick={saveDetail}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
