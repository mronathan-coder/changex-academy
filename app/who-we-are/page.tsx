import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Who We Are | Change_X Academy of Business",
  description: "We are a team performance academy dedicated to helping leaders and their teams achieve meaningful, sustained results.",
};

export default function WhoWeAre() {
  return (
    <>
      <Header />

      {/* ── Page Hero ── */}
      <section className="cx-hero">
        <div className="cx-wrap">
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · Who we are</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>Built</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "80ms" }}>for</span>
              {" "}
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>teams.</span>
            </span>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "240ms" }}>Not</span>
              {" "}
              <span className="acc cx-word-anim" style={{ animationDelay: "320ms" }}>alone.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              We are a team performance academy dedicated to helping leaders and their
              teams achieve meaningful, sustained results.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="/reach-out" className="cx-btn">Start a conversation →</Link>
                <Link href="#how-we-work" className="cx-btn ghost">How we work</Link>
              </div>
              <div className="cx-ticker">
                <span className="d" />Clarity
                <span className="d" />Alignment
                <span className="d" />Accountability
                <span className="d" />Stability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── (01) About Us ── */}
      <section className="cx-section" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no">(01)</span>
            <div>
              <span className="cx-eyebrow">Our story</span>
              <h2 style={{ marginTop: 8 }}>A different kind of academy</h2>
            </div>
          </div>
          <div className="cx-split">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignSelf: "stretch" }}>
              <div className="cx-about-paras" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 19, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "44ch" }}>
                  We partner closely with leaders and their teams to address the real
                  challenges that limit performance: unclear priorities, slow
                  decision-making, lack of accountability, and misaligned goals.
                </p>
                <p style={{ fontSize: 19, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "44ch" }}>
                  We don&apos;t run generic programmes or off-the-shelf workshops. We work
                  directly in the context of your team&apos;s real work, so improvements
                  hold under pressure, not just in the training room.
                </p>
                <p style={{ fontSize: 19, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "44ch" }}>
                  Every engagement is designed around your team&apos;s actual situation,
                  the decisions that keep stalling, the friction that keeps returning,
                  and the changes that need to stick.
                </p>
              </div>
              <Link href="#how-we-work" className="cx-btn dark" style={{ alignSelf: "flex-start" }}>
                See how we work →
              </Link>
            </div>
            <div className="cx-ph" style={{ aspectRatio: "4/3" }} data-animate="">
              <Image src="/speaker-headset.jpg" alt="Speaker presenting to a team" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── (02) The Challenge ── */}
      <section className="cx-prob cx-section" style={{ padding: "48px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }} data-animate="">
            <span className="no">(02)</span>
            <div>
              <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>The real challenge</span>
              <h2 style={{ marginTop: 8 }}>Most organisations are solving the wrong problem</h2>
            </div>
          </div>
          <div className="cx-prob-list">
            {[
              "They focus on individuals, but performance lives at the team level",
              "They introduce change, but don't build the conditions for it to stick",
              "They train people, but don't fix how the work is actually set up",
              "They push harder. What's needed is clarity, not effort",
            ].map((item, i) => (
              <div key={item} className="cx-prob-item" style={{ fontSize: "clamp(16px, 2vw, 28px)", paddingTop: "12px", paddingBottom: "12px" }} data-animate="" data-animate-delay={String(i * 120)}>
                <span className="n">0{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
          <p className="cx-prob-note" style={{ marginTop: 16 }} data-animate="" data-animate-delay="480">
            This is not a people problem. <b>It&apos;s a team system problem.</b>
          </p>
        </div>
      </section>

      {/* ── (03) How We Work ── */}
      <section className="cx-section" id="how-we-work" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no">(03)</span>
            <div>
              <span className="cx-eyebrow">Our approach</span>
              <h2 style={{ marginTop: 8 }}>We work where performance actually happens</h2>
            </div>
          </div>
          <div className="cx-split">
            <div className="cx-ph" style={{ aspectRatio: "4/3" }} data-animate="">
              <Image src="/laughing-audience.png" alt="Audience laughing during a session" fill style={{ objectFit: "cover" }} />
            </div>
            <div className="cx-steps" style={{ alignSelf: "stretch", justifyContent: "space-between" }}>
              {[
                {
                  n: "01",
                  h: "Diagnose what's getting in the way",
                  p: "A practical read on how the team actually operates: priorities, decisions, accountability, and friction points. Not a theoretical model.",
                },
                {
                  n: "02",
                  h: "Reset how decisions and work get done",
                  p: "Clear priorities, ownership and decision rights that hold under pressure. Fewer repeated debates. Less firefighting.",
                },
                {
                  n: "03",
                  h: "Build stability, not dependency",
                  p: "We help teams embed new ways of working so performance becomes consistent, without depending on constant management effort.",
                },
              ].map(({ n, h, p }, i) => (
                <div key={n} className="cx-step" data-animate="" data-animate-delay={String(i * 150)}>
                  <span className="big">{n}</span>
                  <div><h4>{h}</h4><p>{p}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── (04) What Makes Us Different ── */}
      <section className="cx-section" style={{ borderTop: "1px solid var(--line)", padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no">(04)</span>
            <div>
              <span className="cx-eyebrow">What makes us different</span>
              <h2 style={{ marginTop: 8 }}>Four things our approach combines</h2>
            </div>
          </div>
          {[
            {
              tag: "Diagnosis",
              h: "A practical read on what's actually getting in the way",
              p: "We start with how the team really operates, not assumptions. We identify the specific friction points holding performance back.",
            },
            {
              tag: "Conversations",
              h: "Structured team conversations that shift how people operate",
              p: "We facilitate the conversations that leaders often avoid on priorities, ownership, and accountability, and make them productive.",
            },
            {
              tag: "Clarity",
              h: "Clear definition of priorities, roles and decision rights",
              p: "We help teams agree on what matters, who owns what, and how decisions get made, so the same debates stop repeating.",
            },
            {
              tag: "Embedding",
              h: "Ongoing support as teams apply new ways of working",
              p: "We stay alongside teams as they put changes into practice, so new habits form and results become stable over time.",
            },
          ].map(({ tag, h, p }, i) => (
            <div key={h} className="cx-eng-row" style={{ paddingTop: "14px", paddingBottom: "14px" }} data-animate="" data-animate-delay={String(i * 150)}>
              <span className="dur">{tag}</span>
              <div><h3>{h}</h3><p>{p}</p></div>
              <span className="go">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── (05) The Results ── */}
      <section className="cx-results cx-section">
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no" style={{ color: "#fff" }}>(05)</span>
            <div>
              <span className="cx-eyebrow">The results</span>
              <h2 style={{ marginTop: 8 }}>What this looks like in practice</h2>
            </div>
          </div>
          <div className="cx-res-grid" data-animate="">
            {[
              { ico: "↑", lbl: "Higher engagement" },
              { ico: "→", lbl: "Faster execution" },
              { ico: "◇", lbl: "Stronger collaboration" },
              { ico: "✓", lbl: "Better decisions" },
              { ico: "⊞", lbl: "Greater accountability" },
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
        <div className="cx-wrap" data-animate="">
          <h2 className="cx-display">
            Ready to fix<br />how your team <span className="acc">works?</span>
          </h2>
          <p>
            We&apos;ll diagnose what&apos;s holding your team back and recommend a clear,
            practical way forward.
          </p>
          <Link href="/reach-out" className="cx-btn dark">Reach out to us →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
