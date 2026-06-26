import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "What We Do | Change_X Academy of Business",
  description: "Four depths of team engagement, from a one-day reset to a six-month performance transformation.",
};

export default function WhatWeDo() {
  return (
    <>
      <Header />

      {/* ── Page Hero ── */}
      <section className="cx-hero">
        <div className="cx-wrap">
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · What we do</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>Four</span>
              {" "}
              <span className="cx-word-anim" style={{ animationDelay: "80ms" }}>ways</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>to</span>
              {" "}
              <span className="out cx-word-anim" style={{ animationDelay: "240ms" }}>work</span>
            </span>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "320ms" }}>with</span>
              {" "}
              <span className="acc cx-word-anim" style={{ animationDelay: "400ms" }}>us.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              Every engagement is built around your team&apos;s specific situation,
              and the depth depends on how much change you need to make stick.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="#engagements" className="cx-btn">See the options →</Link>
                <Link href="#cta" className="cx-btn ghost">Talk to us</Link>
              </div>
              <div className="cx-ticker">
                <span className="cx-tick"><span className="d" />1 Day</span>
                <span className="cx-tick"><span className="d" />1 Month</span>
                <span className="cx-tick"><span className="d" />3 Months</span>
                <span className="cx-tick"><span className="d" />6 Months</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── (01) The Problem We Solve ── */}
      <section className="cx-prob cx-section" style={{ padding: "48px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }} data-animate="">
            <span className="no">(01)</span>
            <div>
              <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>Why teams stall</span>
              <h2 style={{ marginTop: 8 }}>The same patterns hold most teams back</h2>
            </div>
          </div>
          <div className="cx-prob-list">
            {[
              "Too many priorities competing for attention at once",
              "Unclear ownership: everyone thinks someone else will decide",
              "Agreements made in meetings that don't hold outside them",
              "Effort going up, but output and morale going down",
            ].map((item, i) => (
              <div key={item} className="cx-prob-item" style={{ fontSize: "clamp(16px, 2vw, 28px)", paddingTop: "12px", paddingBottom: "12px" }} data-animate="" data-animate-delay={String(i * 120)}>
                <span className="n">0{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
          <p className="cx-prob-note" style={{ marginTop: 16 }} data-animate="" data-animate-delay="480">
            We fix the system. <b>Not the symptoms.</b>
          </p>
        </div>
      </section>

      {/* ── (02) Engagements ── */}
      <section className="cx-section" id="engagements" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }} data-animate="">
            <span className="no">(02)</span>
            <div>
              <span className="cx-eyebrow">Our engagements</span>
              <h2 style={{ marginTop: 8 }}>Choose the depth that fits your situation</h2>
            </div>
          </div>
          {[
            {
              dur: "1 Day",
              h: "Team Reset",
              sub: "A focused, in-person offsite",
              bullets: [
                "Diagnose the friction slowing the team down",
                "Reset priorities so everyone is aligned",
                "Agree on how decisions will be made going forward",
                "Leave with a clear, shared plan of action",
              ],
              note: "Best for: teams that need clarity fast and a concrete starting point.",
            },
            {
              dur: "1 Month",
              h: "Reset & Redesign",
              sub: "Deeper reset plus structural redesign",
              bullets: [
                "Full team diagnosis: priorities, ownership, decision rights",
                "Facilitated conversations that surface and resolve real tensions",
                "Redesigned team operating model with clear accountability",
                "Follow-up check-in to reinforce what's changed",
              ],
              note: "Best for: teams with recurring issues that a single session won't resolve.",
            },
            {
              dur: "3 Months",
              h: "Make It Stick",
              sub: "Embed new ways of working over time",
              bullets: [
                "Everything in Reset & Redesign, plus sustained support",
                "Monthly working sessions to apply and reinforce changes",
                "Real-time coaching through key decisions and moments",
                "Measurable shift in how the team operates under pressure",
              ],
              note: "Best for: teams going through change who need results that last.",
            },
            {
              dur: "6 Months",
              h: "Perform Under Pressure",
              sub: "Deep, sustained performance transformation",
              bullets: [
                "Full diagnostic and redesign of team systems and culture",
                "Bi-weekly sessions embedded in the team&apos;s real work",
                "Leadership development woven into day-to-day operations",
                "Stable, self-sustaining performance, with less dependence on management effort",
              ],
              note: "Best for: critical teams where high performance is non-negotiable.",
            },
          ].map(({ dur, h, sub, bullets, note }, i) => (
            <div key={h} className="cx-wwd-card" style={{ paddingTop: "18px", paddingBottom: "18px" }} data-animate="" data-animate-delay={String(i * 150)}>
              <div className="cx-wwd-card-head" style={{ marginBottom: 12 }}>
                <span className="dur">{dur}</span>
                <div>
                  <h3>{h}</h3>
                  <p className="sub">{sub}</p>
                </div>
              </div>
              <ul className="cx-wwd-bullets">
                {bullets.map((b) => (
                  <li key={b} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
              <p className="cx-wwd-note">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── (03) What's always included ── */}
      <section className="cx-section cx-section-ink" style={{ borderTop: "1px solid var(--line)", background: "var(--ink)", color: "var(--paper)", padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }} data-animate="">
            <span className="no" style={{ color: "var(--accent)" }}>(03)</span>
            <div>
              <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>Every engagement</span>
              <h2 style={{ marginTop: 8, color: "#fff" }}>What&apos;s always included</h2>
            </div>
          </div>
          {[
            {
              tag: "Diagnosis",
              h: "We start with how the team actually works",
              p: "Before we run a single session, we understand the real situation, not just the stated one. We identify the specific friction holding performance back.",
            },
            {
              tag: "Facilitation",
              h: "Structured conversations that shift behaviour",
              p: "We facilitate the conversations leaders often avoid on priorities, ownership, and accountability, and make them productive rather than painful.",
            },
            {
              tag: "Clarity",
              h: "Clear agreements that hold outside the room",
              p: "We help teams agree on what matters, who owns what, and how decisions get made, so the same debates stop repeating week after week.",
            },
            {
              tag: "Follow-through",
              h: "Support as the changes go into practice",
              p: "We don't disappear after the session. We stay alongside the team so new habits form and improvements don't revert under pressure.",
            },
          ].map(({ tag, h, p }, i) => (
            <div key={h} className="cx-eng-row" style={{ borderColor: "rgba(246,245,241,.14)", paddingTop: "10px", paddingBottom: "10px" }} data-animate="" data-animate-delay={String(i * 150)}>
              <span className="dur" style={{ color: "var(--accent)" }}>{tag}</span>
              <div>
                <h3 style={{ color: "#fff" }}>{h}</h3>
                <p style={{ color: "rgba(246,245,241,.65)" }}>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cx-cta" id="cta">
        <div className="cx-wrap" data-animate="">
          <h2 className="cx-display">
            Not sure which<br />engagement is <span className="acc">right?</span>
          </h2>
          <p>
            Tell us what&apos;s happening and we&apos;ll recommend the right starting point.
            No sales pitch. Just a practical conversation.
          </p>
          <Link href="/reach-out" className="cx-btn dark">Talk to us →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
