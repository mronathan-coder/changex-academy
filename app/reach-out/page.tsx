import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Reach Out | Change_X Academy of Business",
  description: "Get in touch with Change_X Academy — we respond fast, usually the same day.",
};

export default function ReachOut() {
  return (
    <>
      <Header />

      <section className="cx-hero">
        <div className="cx-wrap">
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · Reach out</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>Reach</span>
              {" "}
              <span className="cx-word-anim" style={{ animationDelay: "80ms" }}>out</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>and</span>
              {" "}
              <span className="out cx-word-anim" style={{ animationDelay: "240ms" }}>let&apos;s</span>
            </span>
            <span className="row">
              <span className="acc cx-word-anim" style={{ animationDelay: "320ms" }}>talk.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              We respond fast — usually the same day.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="https://wa.me/27835891601" className="cx-btn" target="_blank" rel="noopener noreferrer">WhatsApp us →</Link>
                <Link href="mailto:info@changexacademy.com" className="cx-btn ghost">Email us →</Link>
              </div>
              <div className="cx-ticker">
                <span className="d" />Fast response
                <span className="d" />WhatsApp
                <span className="d" />Email
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
