import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Coaching | Change_X Academy of Business",
  description: "One-to-one coaching for leaders navigating real performance challenges — not a therapy session, a working relationship.",
};

export default function Coaching() {
  return (
    <>
      <Header />

      {/* ── Page Hero ── */}
      <section className="cx-hero">
        <div className="cx-wrap">
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · Coaching</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>A</span>
              {" "}
              <span className="cx-word-anim" style={{ animationDelay: "80ms" }}>thinking</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>partner</span>
            </span>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "240ms" }}>who</span>
              {" "}
              <span className="acc cx-word-anim" style={{ animationDelay: "320ms" }}>delivers.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              One-to-one coaching for leaders who need clarity, not consolation.
              We work on real challenges in real time.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="#cta" className="cx-btn">Start a conversation →</Link>
                <Link href="#how-it-works" className="cx-btn ghost">How it works</Link>
              </div>
              <div className="cx-ticker">
                <span className="d" />Clarity
                <span className="d" />Decisions
                <span className="d" />Leadership
                <span className="d" />Performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── (01) What coaching is / isn't ── */}
      <section className="cx-prob cx-section" style={{ padding: "48px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }}>
            <span className="no">(01)</span>
            <div>
              <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>What this is</span>
              <h2 style={{ marginTop: 8 }}>Not therapy. Not training. A working relationship.</h2>
            </div>
          </div>
          <div className="cx-prob-list">
            {[
              "You're a capable leader — but the situation is genuinely hard",
              "You need someone who pushes back, not just listens",
              "The challenges are live — decisions can't wait for the next workshop",
              "You want clarity and momentum, not a framework to implement",
            ].map((item, i) => (
              <div key={i} className="cx-prob-item" style={{ fontSize: "clamp(16px, 2vw, 28px)", paddingTop: "12px", paddingBottom: "12px" }}>
                <span className="n">0{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
          <p className="cx-prob-note" style={{ marginTop: 16 }}>
            If that sounds familiar, <b>this is for you.</b>
          </p>
        </div>
      </section>

      {/* ── (02) What we work on ── */}
      <section className="cx-section" id="how-it-works" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }}>
            <span className="no">(02)</span>
            <div>
              <span className="cx-eyebrow">What we work on</span>
              <h2 style={{ marginTop: 8 }}>Real leadership challenges, not hypotheticals</h2>
            </div>
          </div>
          {[
            {
              tag: "Clarity",
              h: "Getting clear on what actually matters right now",
              p: "Too many priorities competing, pressure from multiple directions, an unclear mandate — we help you cut through and decide what to focus on.",
            },
            {
              tag: "Decisions",
              h: "Making the calls you've been avoiding",
              p: "Hard decisions with incomplete information, under political pressure, with real consequences. We work through them with you — not for you.",
            },
            {
              tag: "Team",
              h: "Leading the team you have, not the one you want",
              p: "Managing conflict, rebuilding trust, resetting expectations, navigating a poor performer — practical coaching on the real people dynamics.",
            },
            {
              tag: "Presence",
              h: "How you show up when it matters most",
              p: "Confidence in the room, conviction under challenge, composure under pressure. We work on the leader you need to be in this specific context.",
            },
          ].map(({ tag, h, p }) => (
            <div key={h} className="cx-eng-row" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
              <span className="dur">{tag}</span>
              <div><h3>{h}</h3><p dangerouslySetInnerHTML={{ __html: p }} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── (03) How it works ── */}
      <section className="cx-section" style={{ borderTop: "1px solid var(--line)", padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row">
            <span className="no">(03)</span>
            <div>
              <span className="cx-eyebrow">The format</span>
              <h2 style={{ marginTop: 8 }}>Structured, focused, and on your schedule</h2>
            </div>
          </div>
          <div className="cx-steps">
            {[
              {
                n: "01",
                h: "An initial diagnostic conversation",
                p: "We start by understanding the real situation — your role, your team, the challenges that are front of mind. No intake forms, just a direct conversation.",
              },
              {
                n: "02",
                h: "Regular working sessions",
                p: "Fortnightly or monthly sessions focused on a live challenge. We go where the work demands, not where a pre-set agenda dictates.",
              },
              {
                n: "03",
                h: "Between-session support",
                p: "Access between sessions for decisions that can&apos;t wait. A quick call, a message, a sanity check — we&apos;re available when it matters.",
              },
              {
                n: "04",
                h: "Progress that compounds",
                p: "Each session builds on the last. Over time, you make better decisions faster, lead with more confidence, and rely less on external input.",
              },
            ].map(({ n, h, p }) => (
              <div key={n} className="cx-step">
                <span className="big">{n}</span>
                <div>
                  <h4>{h}</h4>
                  <p dangerouslySetInnerHTML={{ __html: p }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── (04) Results ── */}
      <section className="cx-results cx-section">
        <div className="cx-wrap">
          <div className="cx-label-row">
            <span className="no" style={{ color: "#fff" }}>(04)</span>
            <div>
              <span className="cx-eyebrow">What changes</span>
              <h2 style={{ marginTop: 8 }}>What leaders tell us shifts</h2>
            </div>
          </div>
          <div className="cx-res-grid">
            {[
              { ico: "→", lbl: "Faster, clearer decisions" },
              { ico: "↑", lbl: "Greater confidence" },
              { ico: "◇", lbl: "Better team dynamics" },
              { ico: "✓", lbl: "Less firefighting" },
              { ico: "⊞", lbl: "Stronger leadership presence" },
            ].map(({ ico, lbl }) => (
              <div key={lbl} className="cx-res">
                <div className="ico">{ico}</div>
                <div className="lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cx-cta" id="cta">
        <div className="cx-wrap">
          <h2 className="cx-display">
            Ready to think<br />more <span className="acc">clearly?</span>
          </h2>
          <p>
            Start with a no-obligation conversation. We&apos;ll work out together
            whether coaching is the right move — and what it should look like for you.
          </p>
          <Link href="/reach-out" className="cx-btn dark">Book an initial call →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
