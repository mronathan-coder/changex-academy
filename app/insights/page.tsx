import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SubscribeModal from "../components/SubscribeModal";

export const metadata: Metadata = {
  title: "Insights | Change_X Academy of Business",
  description: "Practical perspectives on team performance, leadership, and the real reasons organisations stall.",
};

export default function Insights() {
  return (
    <>
      <Header />

      {/* ── Page Hero ── */}
      <section className="cx-hero">
        <div className="cx-wrap">
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · Insights</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>Thinking</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "80ms" }}>on</span>
              {" "}
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>teams</span>
            </span>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "240ms" }}>and</span>
              {" "}
              <span className="acc cx-word-anim" style={{ animationDelay: "320ms" }}>work.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              Practical perspectives on team performance, leadership, and the
              real reasons organisations stall — and what to do about it.
            </p>
            <div className="right">
              <div className="cx-ticker">
                <span className="cx-tick"><span className="d" />Team performance</span>
                <span className="cx-tick"><span className="d" />Leadership</span>
                <span className="cx-tick"><span className="d" />Decision-making</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="cx-section" id="articles" style={{ padding: "80px 0 100px" }}>
        <div className="cx-wrap">
          <div data-animate="" style={{ maxWidth: "600px" }}>
            <span className="cx-eyebrow" style={{ color: "var(--accent)", display: "block", marginBottom: "20px" }}>Coming soon</span>
            <p style={{ fontSize: "clamp(22px, 3.2vw, 36px)", lineHeight: 1.5, color: "var(--ink)", opacity: 0.85 }}>
              Our insights are on their way. Check back soon for articles, tools,
              and thinking from the ChangeX Academy team.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cx-cta" id="cta">
        <div className="cx-wrap" data-animate="">
          <h2 className="cx-display">
            Want these<br />in your <span className="acc">inbox?</span>
          </h2>
          <p>
            We will be publishing new thinking on a regular basis. Subscribe to
            our monthly insights using the button below.
          </p>
          <SubscribeModal />
        </div>
      </section>

      <Footer />
    </>
  );
}
