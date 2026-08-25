"use client";

import { useEffect, useRef, useState } from "react";
import { plainText } from "@/utils/plainText";

// A small, dependency-free rich text editor for HTML-column fields (course
// description, article body, etc.) — ported in spirit from the Claude
// Design source's Quill-based editor, but built on contentEditable +
// execCommand instead of pulling in Quill (React 19 compatibility for
// react-quill-style wrappers is shaky, and this keeps the bundle self-contained).
// Two known simplifications vs. the design: no persistent "active format"
// highlighting on the toolbar buttons, and the link button uses a plain
// `prompt()` instead of Quill's inline link tooltip.
//
// Give this a `key` prop tied to whatever record is being edited (e.g. the
// course id, or "new") so React remounts a fresh instance — and re-syncs
// contentEditable from `value` — whenever the caller switches records.
const TOOLBAR_BUTTON_STYLE = {
  height: 26,
  minWidth: 26,
  padding: "0 8px",
  border: "none",
  borderRadius: "var(--radius-sm)",
  background: "transparent",
  color: "var(--text-secondary)",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  cursor: "pointer",
};

function ToolbarButton({ label, title, style, onClick }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()} // keep editor selection focused
      onClick={onClick}
      style={{ ...TOOLBAR_BUTTON_STYLE, ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span style={{ width: 1, alignSelf: "stretch", background: "var(--border)", margin: "4px 2px" }} />;
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!plainText(value));

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = () => {
    const html = editorRef.current?.innerHTML || "";
    setIsEmpty(!plainText(html));
    onChange(html);
  };

  const exec = (command, arg) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleLink = () => {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  };

  const backToEditor = () => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
    setSourceOpen(false);
  };

  const wordCount = plainText(value).split(" ").filter(Boolean).length;

  return (
    <div style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-card)" }}>
      {!sourceOpen && (
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 8px", borderBottom: "1px solid var(--border)", background: "var(--surface-sunken)", flexWrap: "wrap" }}>
          <ToolbarButton label="H2" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} style={{ fontFamily: "var(--font-display)", fontWeight: 600 }} />
          <ToolbarButton label="H3" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11 }} />
          <ToolbarButton label="P" title="Paragraph" onClick={() => exec("formatBlock", "<p>")} />
          <Divider />
          <ToolbarButton label="B" title="Bold" onClick={() => exec("bold")} style={{ fontWeight: 700 }} />
          <ToolbarButton label="I" title="Italic" onClick={() => exec("italic")} style={{ fontStyle: "italic" }} />
          <ToolbarButton label="U" title="Underline" onClick={() => exec("underline")} style={{ textDecoration: "underline" }} />
          <Divider />
          <ToolbarButton label="1." title="Numbered list" onClick={() => exec("insertOrderedList")} />
          <ToolbarButton label="•" title="Bulleted list" onClick={() => exec("insertUnorderedList")} />
          <Divider />
          <ToolbarButton label="❝" title="Blockquote" onClick={() => exec("formatBlock", "<blockquote>")} />
          <ToolbarButton label="Link" title="Insert link" onClick={handleLink} />
          <Divider />
          <ToolbarButton label="Clear" title="Clear formatting" onClick={() => exec("removeFormat")} />
        </div>
      )}

      <div style={{ position: "relative", display: sourceOpen ? "none" : "block" }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          style={{
            minHeight: 200,
            maxHeight: 420,
            overflowY: "auto",
            padding: "12px 15px",
            fontSize: "var(--fs-body-sm)",
            lineHeight: 1.65,
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        {isEmpty && (
          <div style={{ position: "absolute", top: 12, left: 15, right: 15, fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", pointerEvents: "none" }}>
            {placeholder}
          </div>
        )}
      </div>

      {sourceOpen && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            minHeight: 230,
            border: "none",
            padding: "12px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-primary)",
            background: "var(--surface-card)",
            outline: "none",
            resize: "vertical",
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderTop: "1px solid var(--border)", background: "var(--surface-sunken)" }}>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {wordCount} {wordCount === 1 ? "word" : "words"} · saved to description
        </span>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          title="Edit the raw HTML"
          onClick={() => (sourceOpen ? backToEditor() : setSourceOpen(true))}
          style={{
            height: 26,
            padding: "0 10px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: sourceOpen ? "var(--surface-card)" : "var(--surface-sunken)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-card)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = sourceOpen ? "var(--surface-card)" : "var(--surface-sunken)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          {sourceOpen ? "Back to editor" : "Edit HTML"}
        </button>
      </div>
    </div>
  );
}
