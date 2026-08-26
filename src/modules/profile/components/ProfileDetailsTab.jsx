"use client";

import { Button, Input } from "@/components/ui";

export default function ProfileDetailsTab({ detailGroups, editDetails, savedDetails, startEditDetails, saveDetails, cancelDetails }) {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {detailGroups.map((group) => (
        <fieldset key={group.title} style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
          <legend style={{ padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>{group.title}</legend>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 20px" }}>
            {group.fields.map((field) => (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>{field.label}</span>
                {!editDetails && (
                  <div style={{ padding: "9px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", minHeight: 20, overflowWrap: "anywhere" }}>
                    {field.value}
                  </div>
                )}
                {editDetails && <Input value={field.editValue} onChange={field.onChange} />}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      {savedDetails && (
        <div style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--state-success-bg)", color: "var(--state-success)", fontSize: "var(--fs-body-sm)" }}>
          Information saved.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {!editDetails && (
          <Button variant="accent" onClick={startEditDetails}>
            Edit information
          </Button>
        )}
        {editDetails && (
          <>
            <Button variant="secondary" onClick={cancelDetails}>
              Cancel
            </Button>
            <Button variant="accent" onClick={saveDetails}>
              Save information
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
