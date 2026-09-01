"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  NEWSLETTER_CAMPAIGNS,
  NEWSLETTER_SUBSCRIBERS,
  NEWSLETTER_SEGMENTS,
  NEWSLETTER_SOURCES,
  NEWSLETTER_STATUSES,
  NEWSLETTER_STATUS_LABELS,
  NEWSLETTER_STATUS_TONES,
  NEWSLETTER_SUB_STATUSES,
  NEWSLETTER_SUB_STATUS_LABELS,
  NEWSLETTER_SUB_STATUS_TONES,
} from "../constants/newsletter.mock";
import { plainText } from "@/utils/plainText";

const BLANK_FORM = {
  id: null,
  subject: "",
  preheader: "",
  segment: "all",
  from_name: "BWIN Consultants",
  from_email: "hello@bwinconsultants.com",
  reply_to: "hello@bwinconsultants.com",
  body: "",
  scheduled_at: "",
};
const BLANK_SUB_FORM = { full_name: "", email: "", segment: "all" };
const EMAIL_PATTERN = /.+@.+\..+/;

const segLabel = (v) => {
  const found = NEWSLETTER_SEGMENTS.find((o) => o.value === v);
  return found ? found.label : v;
};
const rate = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");
const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useNewsletter() {
  const [campaigns, setCampaigns] = useState(NEWSLETTER_CAMPAIGNS);
  const [subscribers, setSubscribers] = useState(NEWSLETTER_SUBSCRIBERS);
  const [tab, setTab] = useState("campaigns"); // "campaigns" | "subscribers"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [thirdFilter, setThirdFilter] = useState("all");

  const [viewId, setViewId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [subForm, setSubForm] = useState(BLANK_SUB_FORM);
  const [subFormError, setSubFormError] = useState(null);

  const [seq, setSeq] = useState(0);
  const { showSuccess } = useToast();

  const onCampaigns = tab === "campaigns";

  const reach = (segment) => {
    const subs = subscribers.filter((s) => s.status === "subscribed");
    return segment === "all" ? subs.length : subs.filter((s) => s.segment === segment).length;
  };

  const campFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter(
      (c) =>
        (statusFilter === "all" || c.status === statusFilter) &&
        (segmentFilter === "all" || c.segment === segmentFilter) &&
        (thirdFilter === "all" || c.created_by === thirdFilter) &&
        (!q || `${c.subject} ${c.preheader} ${c.id} ${c.created_by}`.toLowerCase().includes(q))
    );
  }, [campaigns, search, statusFilter, segmentFilter, thirdFilter]);

  const subFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter(
      (u) =>
        (statusFilter === "all" || u.status === statusFilter) &&
        (segmentFilter === "all" || u.segment === segmentFilter) &&
        (thirdFilter === "all" || u.source === thirdFilter) &&
        (!q || `${u.full_name} ${u.email} ${u.id} ${u.source}`.toLowerCase().includes(q))
    );
  }, [subscribers, search, statusFilter, segmentFilter, thirdFilter]);

  const subscribedCount = subscribers.filter((u) => u.status === "subscribed").length;
  const sentCamps = campaigns.filter((c) => c.status === "sent");
  const totalDelivered = sentCamps.reduce((a, c) => a + c.delivered_count, 0);
  const totalOpens = sentCamps.reduce((a, c) => a + c.open_count, 0);
  const totalClicks = sentCamps.reduce((a, c) => a + c.click_count, 0);

  const stats = [
    { label: "Active subscribers", value: subscribedCount.toLocaleString(), sub: `${subscribers.length} total on list` },
    { label: "Campaigns sent", value: String(sentCamps.length), sub: `${totalDelivered.toLocaleString()} emails delivered` },
    { label: "Average open rate", value: rate(totalOpens, totalDelivered), sub: `${totalOpens.toLocaleString()} opens` },
    { label: "Average click rate", value: rate(totalClicks, totalDelivered), sub: `${totalClicks.toLocaleString()} clicks` },
  ];

  const switchTab = (key) => {
    setTab(key);
    setStatusFilter("all");
    setSegmentFilter("all");
    setThirdFilter("all");
    setSearch("");
  };
  const tabs = [
    { key: "campaigns", label: `Campaigns (${campaigns.length})` },
    { key: "subscribers", label: `Subscribers (${subscribers.length})` },
  ].map((t) => ({ ...t, active: tab === t.key, onClick: () => switchTab(t.key) }));

  const openEdit = (c) => {
    setComposeOpen(true);
    setFormError(null);
    setForm({
      id: c.id,
      subject: c.subject,
      preheader: c.preheader || "",
      segment: c.segment,
      from_name: c.from_name,
      from_email: c.from_email,
      reply_to: c.reply_to,
      body: c.body,
      scheduled_at: c.scheduled_at ? c.scheduled_at.replace(" ", "T") : "",
    });
  };

  const campaignRows = campFiltered.map((c) => ({
    ...c,
    segmentLabel: segLabel(c.segment),
    statusLabel: NEWSLETTER_STATUS_LABELS[c.status] || c.status,
    statusTone: NEWSLETTER_STATUS_TONES[c.status] || "neutral",
    recipientLabel: c.recipient_count ? `${c.recipient_count.toLocaleString()} recipients` : "no recipients yet",
    rateLabel: c.delivered_count ? `${rate(c.open_count, c.delivered_count)} / ${rate(c.click_count, c.delivered_count)}` : "—",
    openBar: c.delivered_count ? `${Math.round((c.open_count / c.delivered_count) * 100)}%` : "0%",
    whenValue: c.sent_at || c.scheduled_at || "—",
    onView: () => setViewId(c.id),
    onEdit: () => openEdit(c),
  }));

  const setSubscriberStatus = (id, status) => {
    const sub = subscribers.find((u) => u.id === id);
    setSubscribers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    if (sub) showSuccess(`${sub.email} marked ${(NEWSLETTER_SUB_STATUS_LABELS[status] || status).toLowerCase()}.`);
  };
  const removeSubscriber = (id) => {
    const sub = subscribers.find((u) => u.id === id);
    setSubscribers((prev) => prev.filter((u) => u.id !== id));
    if (sub) showSuccess(`Removed ${sub.email} from the list.`);
  };

  const subscriberRows = subFiltered.map((u) => ({
    ...u,
    segmentLabel: segLabel(u.segment),
    openRateLabel: u.status === "subscribed" ? `${u.open_rate}%` : "—",
    onStatusChange: (status) => setSubscriberStatus(u.id, status),
    onRemove: () => removeSubscriber(u.id),
  }));

  const current = campaigns.find((c) => c.id === viewId) || null;

  const detail = current
    ? {
        ...current,
        segmentLabel: segLabel(current.segment),
        statusLabel: NEWSLETTER_STATUS_LABELS[current.status] || current.status,
        statusTone: NEWSLETTER_STATUS_TONES[current.status] || "neutral",
        hasPreheader: !!current.preheader,
      }
    : null;

  const detailMetrics = current
    ? [
        { label: "Recipients", value: current.recipient_count.toLocaleString(), sub: segLabel(current.segment) },
        { label: "Delivered", value: current.delivered_count.toLocaleString(), sub: `${rate(current.delivered_count, current.recipient_count)} of recipients` },
        { label: "Opens", value: current.open_count.toLocaleString(), sub: `${rate(current.open_count, current.delivered_count)} open rate` },
        { label: "Clicks", value: current.click_count.toLocaleString(), sub: `${rate(current.click_count, current.delivered_count)} click rate` },
        { label: "Unsubscribes", value: current.unsubscribe_count.toLocaleString(), sub: `${rate(current.unsubscribe_count, current.delivered_count)} of delivered` },
        { label: "Bounces", value: current.bounce_count.toLocaleString(), sub: `${rate(current.bounce_count, current.recipient_count)} of recipients` },
      ]
    : [];

  const detailFields = current
    ? [
        { label: "Status", value: NEWSLETTER_STATUS_LABELS[current.status] || current.status, font: "var(--font-body)" },
        { label: "Segment", value: segLabel(current.segment), font: "var(--font-body)" },
        { label: "From", value: `${current.from_name} <${current.from_email}>`, font: "var(--font-body)" },
        { label: "Reply-to", value: current.reply_to, font: "var(--font-mono)" },
        { label: "Created by", value: current.created_by, font: "var(--font-body)" },
        { label: "Created at", value: current.created_at, font: "var(--font-mono)" },
        { label: "Scheduled at", value: current.scheduled_at || "—", font: "var(--font-mono)" },
        { label: "Sent at", value: current.sent_at || "—", font: "var(--font-mono)" },
      ]
    : [];

  const closeDetail = () => setViewId(null);
  const editFromDetail = () => {
    if (current) {
      setViewId(null);
      openEdit(current);
    }
  };

  const openCompose = () => {
    setComposeOpen(true);
    setForm(BLANK_FORM);
    setFormError(null);
  };
  const closeCompose = () => {
    setComposeOpen(false);
    setForm(BLANK_FORM);
    setFormError(null);
  };
  const setFormField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  };

  const saveCampaign = (mode) => {
    if (!form.subject.trim()) {
      setFormError("Add a subject line before saving.");
      return;
    }
    if (mode !== "draft" && !plainText(form.body)) {
      setFormError("Write the email content before sending.");
      return;
    }
    const scheduled = form.scheduled_at ? form.scheduled_at.replace("T", " ") : null;
    const status = mode === "draft" ? "draft" : scheduled ? "scheduled" : "sent";
    const stamp = nowStamp();
    const recipients = status === "draft" ? 0 : reach(form.segment);

    if (form.id) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? {
                ...c,
                subject: form.subject.trim(),
                preheader: form.preheader,
                segment: form.segment,
                from_name: form.from_name,
                from_email: form.from_email,
                reply_to: form.reply_to,
                body: form.body,
                status,
                scheduled_at: scheduled,
                sent_at: status === "sent" ? c.sent_at || stamp : null,
                recipient_count: status === "draft" ? 0 : c.recipient_count || recipients,
              }
            : c
        )
      );
      setComposeOpen(false);
      setForm(BLANK_FORM);
      setFormError(null);
      showSuccess(`Saved changes to ${form.id}.`);
      return;
    }

    const nextSeq = seq + 1;
    const item = {
      id: `NL-${1045 + nextSeq}`,
      subject: form.subject.trim(),
      preheader: form.preheader,
      segment: form.segment,
      from_name: form.from_name,
      from_email: form.from_email,
      reply_to: form.reply_to,
      body: form.body,
      status,
      recipient_count: recipients,
      delivered_count: status === "sent" ? recipients : 0,
      open_count: 0,
      click_count: 0,
      unsubscribe_count: 0,
      bounce_count: 0,
      created_by: "You",
      scheduled_at: scheduled,
      sent_at: status === "sent" ? stamp : null,
      created_at: stamp,
    };
    setCampaigns((prev) => [item, ...prev]);
    setSeq(nextSeq);
    setComposeOpen(false);
    setForm(BLANK_FORM);
    setFormError(null);
    showSuccess(
      status === "draft"
        ? `Draft saved — ${item.id}.`
        : status === "scheduled"
        ? `${item.id} scheduled for ${scheduled}.`
        : `${item.id} sent to ${recipients} subscribers.`
    );
  };

  const sendTest = () => showSuccess("Test email sent to hello@bwinconsultants.com.");

  const openAdd = () => {
    setAddOpen(true);
    setSubForm(BLANK_SUB_FORM);
    setSubFormError(null);
  };
  const closeAdd = () => {
    setAddOpen(false);
    setSubFormError(null);
  };
  const setSubFormField = (key, value) => {
    setSubForm((f) => ({ ...f, [key]: value }));
    setSubFormError(null);
  };

  const submitAdd = () => {
    if (!subForm.full_name.trim() || !EMAIL_PATTERN.test(subForm.email)) {
      setSubFormError("A name and a valid email address are both needed.");
      return;
    }
    if (subscribers.some((u) => u.email.toLowerCase() === subForm.email.trim().toLowerCase())) {
      setSubFormError("That email is already on the list.");
      return;
    }
    const stamp = nowStamp();
    const nextSeq = seq + 1;
    const item = {
      id: `SB-${8802 + seq}`,
      full_name: subForm.full_name.trim(),
      email: subForm.email.trim(),
      status: "pending",
      segment: subForm.segment,
      source: "Manual",
      open_rate: 0,
      subscribed_at: stamp,
      last_activity: stamp,
    };
    setSubscribers((prev) => [item, ...prev]);
    setSeq(nextSeq);
    setAddOpen(false);
    showSuccess(`Added ${item.email} — opt-in email sent.`);
  };

  const primaryActionLabel = onCampaigns ? "New campaign" : "Add subscriber";
  const primaryAction = onCampaigns ? openCompose : openAdd;

  const exportCsv = () => {
    if (onCampaigns) {
      const cols = ["id", "subject", "segment", "status", "recipient_count", "open_count", "click_count", "sent_at"];
      const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
      const csv = [cols.join(",")].concat(campFiltered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "bwin-newsletter-campaigns.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showSuccess(`Exported ${campFiltered.length} campaigns to CSV.`);
    } else {
      const cols = ["id", "full_name", "email", "status", "segment", "source", "open_rate", "subscribed_at"];
      const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
      const csv = [cols.join(",")].concat(subFiltered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "bwin-newsletter-subscribers.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showSuccess(`Exported ${subFiltered.length} subscribers to CSV.`);
    }
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(
    onCampaigns
      ? NEWSLETTER_STATUSES.map((v) => ({ value: v, label: NEWSLETTER_STATUS_LABELS[v] || v }))
      : NEWSLETTER_SUB_STATUSES.map((v) => ({ value: v, label: NEWSLETTER_SUB_STATUS_LABELS[v] || v }))
  );
  const segmentFilterOptions = [{ value: "all", label: "All segments" }].concat(NEWSLETTER_SEGMENTS.filter((o) => o.value !== "all"));
  const thirdFilterLabel = onCampaigns ? "Sent by" : "Source";
  const thirdFilterOptions = onCampaigns
    ? [{ value: "all", label: "Anyone" }].concat([...new Set(campaigns.map((c) => c.created_by))].map((v) => ({ value: v, label: v })))
    : [{ value: "all", label: "All sources" }].concat(NEWSLETTER_SOURCES.map((v) => ({ value: v, label: v })));
  const subStatusChangeOptions = NEWSLETTER_SUB_STATUSES.map((v) => ({ value: v, label: NEWSLETTER_SUB_STATUS_LABELS[v] || v }));

  return {
    listVisible: !current,
    detailVisible: !!current,
    campaignsTab: onCampaigns,
    subscribersTab: !onCampaigns,
    stats,
    tabs,
    campaignRows,
    subscriberRows,
    noCampaigns: onCampaigns && campaigns.length > 0 && campFiltered.length === 0,
    noSubscribers: !onCampaigns && subscribers.length > 0 && subFiltered.length === 0,
    resultCount: onCampaigns ? `${campFiltered.length} of ${campaigns.length} campaigns` : `${subFiltered.length} of ${subscribers.length} subscribers`,
    primaryActionLabel,
    primaryAction,
    exportCsv,

    search,
    setSearch,
    searchLabel: onCampaigns ? "Search subject, preheader or ID" : "Search name, email or ID",
    searchPlaceholder: onCampaigns ? "e.g. cohorts, NL-1042" : "e.g. Amara, gmail.com",
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter,
    thirdFilter,
    setThirdFilter,
    statusOptions,
    segmentFilterOptions,
    thirdFilterLabel,
    thirdFilterOptions,
    subStatusChangeOptions,
    resetFilters: () => {
      setSearch("");
      setStatusFilter("all");
      setSegmentFilter("all");
      setThirdFilter("all");
    },

    detail,
    detailMetrics,
    detailFields,
    closeDetail,
    editFromDetail,

    composeOpen,
    composeTitle: form.id ? `Edit campaign ${form.id}` : "New campaign",
    composeSubtitle: form.id ? "Changes apply to the saved campaign" : "Goes to everyone in the segment you pick",
    closeCompose,
    form,
    setFormField,
    formError,
    segmentOptions: NEWSLETTER_SEGMENTS,
    segmentReach: `${reach(form.segment)} active subscribers in this segment`,
    submitLabel: form.scheduled_at ? "Schedule campaign" : "Send campaign",
    submitCompose: () => saveCampaign("send"),
    saveDraft: () => saveCampaign("draft"),
    sendTest,

    addOpen,
    openAdd,
    closeAdd,
    subForm,
    setSubFormField,
    subFormError,
    submitAdd,
  };
}
