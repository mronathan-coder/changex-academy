"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "duplicate";

export default function SubscribeModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: "",
  });

  useEffect(() => { setMounted(true); }, []);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const supabase = createClient();
    const { error } = await supabase.from("subscribers").insert({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email.toLowerCase().trim(),
      company: form.company,
      country: form.country,
    });

    if (error) {
      // 23505 = unique_violation (duplicate email)
      if (error.code === "23505") {
        setStatus("duplicate");
      } else {
        // Re-throw unexpected errors as duplicate to avoid exposing internals
        setStatus("duplicate");
      }
    } else {
      setStatus("success");
    }
  }

  function handleClose() {
    setOpen(false);
    // Reset form after closing so it's fresh if reopened
    setTimeout(() => {
      setStatus("idle");
      setForm({ firstName: "", lastName: "", email: "", company: "", country: "" });
    }, 300);
  }

  const overlay = open && (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={{
        background: "var(--paper)",
        borderRadius: 8,
        border: "1px solid #000",
        padding: "48px",
        width: "100%",
        maxWidth: 520,
        position: "relative",
      }}>
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: "var(--ink-soft)", lineHeight: 1,
          }}
          aria-label="Close"
        >×</button>

        {(status === "success" || status === "duplicate") ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <h3 style={{ fontFamily: "var(--display)", fontSize: 24, marginBottom: 12 }}>Subscribed!</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>
              You are now on our list. We will be in touch when new thinking drops.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
              Subscribe to our monthly insights
            </h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 15, marginBottom: 28 }}>
              No noise. Just practical perspectives on team performance, delivered once a month.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={labelStyle}>First name</span>
                  <input required type="text" value={form.firstName} onChange={set("firstName")} style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={labelStyle}>Last name</span>
                  <input required type="text" value={form.lastName} onChange={set("lastName")} style={inputStyle} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={labelStyle}>Email address</span>
                <input required type="email" value={form.email} onChange={set("email")} style={inputStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={labelStyle}>Company</span>
                <input required type="text" value={form.company} onChange={set("company")} style={inputStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={labelStyle}>Country</span>
                <input required type="text" value={form.country} onChange={set("country")} style={inputStyle} />
              </label>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="cx-btn dark"
                style={{ marginTop: 8, cursor: status === "submitting" ? "wait" : "pointer", border: "none", alignSelf: "flex-start", opacity: status === "submitting" ? 0.6 : 1 }}
              >
                {status === "submitting" ? "Subscribing…" : "Subscribe →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        className="cx-btn dark"
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer", border: "none" }}
      >
        Subscribe to our monthly insights →
      </button>

      {mounted && overlay && createPortal(overlay, document.body)}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--ink-soft)",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 15,
  border: "1px solid var(--line)",
  borderRadius: 4,
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};
