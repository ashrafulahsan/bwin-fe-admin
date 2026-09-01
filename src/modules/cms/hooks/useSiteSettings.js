"use client";

import { useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { SETTINGS, SITE_MENUS } from "../constants/settings.mock";

const GROUPS = ["General", "Header", "Footer", "Social media"];
const HINTS = {
  General: "Site-wide basics: title, favicon, language and the visitor chat widget.",
  Header: "Contact details and logo shown in the public site header.",
  Footer: "Footer logo, about blurb, footer menus and small print.",
  "Social media": "Links used across the public site and share buttons.",
};
const isData = (v) => /^data:/.test(v || "");
const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useSiteSettings() {
  const [rows, setRows] = useState(SETTINGS);
  const [group, setGroup] = useState("General");
  const [drafts, setDrafts] = useState(() => {
    const d = {};
    SETTINGS.forEach((r) => {
      d[r.id] = r.value;
    });
    return d;
  });
  const [dirty, setDirty] = useState({});
  const [dragKey, setDragKey] = useState(null);
  const { showSuccess, showWarning } = useToast();
  const fileRefsMap = useRef(new Map());

  const fileRef = (id) => {
    if (!fileRefsMap.current.has(id)) fileRefsMap.current.set(id, { current: null });
    return fileRefsMap.current.get(id);
  };

  const setDraft = (id, v) => {
    setDrafts((prev) => ({ ...prev, [id]: v }));
    setDirty((prev) => ({ ...prev, [id]: true }));
  };

  const takeFile = (id, file) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      showWarning("That file is not an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(id, reader.result);
      setDragKey(null);
    };
    reader.readAsDataURL(file);
  };

  const save = (row) => {
    const value = drafts[row.id];
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, value, updated_at: nowStamp() } : r)));
    setDirty((prev) => ({ ...prev, [row.id]: false }));
    showSuccess(`Updated "${row.label}".`);
  };

  const countByGroup = (g) => rows.filter((r) => r.group === g).length;
  const groupTabs = GROUPS.map((g) => ({
    key: g,
    label: g,
    count: countByGroup(g),
    active: group === g,
    onClick: () => setGroup(g),
  }));

  const activeRows = rows
    .filter((r) => r.group === group)
    .map((row) => {
      const draft = drafts[row.id] ?? row.value;
      const isDirty = !!dirty[row.id];
      const options =
        row.value_type === "select"
          ? typeof row.options[0] === "string"
            ? row.options.map((o) => ({ value: o, label: o }))
            : row.options
          : row.value_type === "menu"
            ? SITE_MENUS
            : [];
      const hasImage = !!(draft || "").trim();
      return {
        id: row.id,
        key: row.key,
        label: row.label,
        description: row.description || "No description provided.",
        isSystem: row.is_system,
        isText: row.value_type === "text",
        isUrl: row.value_type === "url",
        isTextarea: row.value_type === "textarea",
        isSelect: row.value_type === "select" || row.value_type === "menu",
        isImage: row.value_type === "image",
        draft,
        options,
        placeholder: row.label,
        onChange: (e) => setDraft(row.id, e.target.value),
        hasImage,
        previewCss: isData(draft) ? `url("${draft}")` : "none",
        uploadLabel: hasImage ? "Replace image" : "Upload image",
        fileHint: draft ? (isData(draft) ? "New file selected" : draft) : "Drop a file here, or upload one.",
        fileRef: fileRef(row.id),
        dropBorder: dragKey === row.id ? "var(--orange-500)" : "var(--border-strong)",
        dropBg: dragKey === row.id ? "var(--surface-sunken)" : "transparent",
        onPick: () => fileRef(row.id).current && fileRef(row.id).current.click(),
        onFile: (e) => takeFile(row.id, e.target.files && e.target.files[0]),
        onClearImage: () => setDraft(row.id, ""),
        onDragOver: (e) => {
          e.preventDefault();
          if (dragKey !== row.id) setDragKey(row.id);
        },
        onDragLeave: () => setDragKey(null),
        onDrop: (e) => {
          e.preventDefault();
          takeFile(row.id, e.dataTransfer.files && e.dataTransfer.files[0]);
        },
        saveDisabled: !isDirty,
        saveColor: isDirty ? "var(--orange-600)" : "var(--text-muted)",
        onSave: () => isDirty && save(row),
        metaLine: `updated ${row.updated_at}`,
      };
    });

  return {
    countLine: `${rows.length} settings`,
    groupTabs,
    activeGroupLabel: group,
    activeGroupHint: HINTS[group],
    activeRows,
  };
}
