"use client";
import { useState } from "react";

export default function SubscribeModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <button
        className="cx-btn dark"
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer", border: "none" }}
      >
        Subscribe to our monthly insights →
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            background: "var(--paper)",
            borderRadius: 8,
            padding: "48px",
            width: "100%",
            maxWidth: 520,
            position: "relative",
          }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 16, right: 20,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 22, color: "var(--ink-soft)", lineHeight: 1,
              }}
              aria-label="Close"
            >×</button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 24, marginBottom: 12 }}>You're in.</h3>
                <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>
                  We'll send you our next piece of thinking when it's ready.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                  Subscribe to our monthly insights
                </h3>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, marginBottom: 28 }}>
                  No noise — just practical perspectives on team performance, delivered once a month.
                </p>
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>First name</span>
                      <input required type="text" placeholder="Jane" style={inputStyle} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>Last name</span>
                      <input required type="text" placeholder="Smith" style={inputStyle} />
                    </label>
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>Email address</span>
                    <input required type="email" placeholder="jane@company.com" style={inputStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>Company</span>
                    <input required type="text" placeholder="Acme Corp" style={inputStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>Country</span>
                    <input required type="text" placeholder="United Kingdom" style={inputStyle} />
                  </label>
                  <button
                    type="submit"
                    className="cx-btn dark"
                    style={{ marginTop: 8, cursor: "pointer", border: "none", alignSelf: "flex-start" }}
                  >
                    Subscribe →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

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
