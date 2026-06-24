import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="cx-hero">
        <div className="cx-wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="kicker" style={{ marginBottom: 13 }}>
            <span className="cx-eyebrow">Change_X · Team performance</span>
          </div>
          <h1 className="cx-display" style={{ fontSize: "clamp(44px,10vw,160px)" }}>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "0ms" }}>Don&apos;t</span>
              {" "}
              <span className="cx-word-anim" style={{ animationDelay: "80ms" }}>work</span>
            </span>
            <span className="row">
              <span className="out cx-word-anim" style={{ animationDelay: "160ms" }}>harder.</span>
            </span>
            <span className="row">
              <span className="cx-word-anim" style={{ animationDelay: "240ms" }}>Work</span>
              {" "}
              <span className="acc cx-word-anim" style={{ animationDelay: "320ms" }}>aligned.</span>
            </span>
          </h1>
          <div className="cx-hero-foot">
            <p className="lede">
              Performance improves when teams are clear, aligned, and able to make decisions that stick.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="/reach-out" className="cx-btn">Start a conversation →</Link>
                <Link href="#approach" className="cx-btn ghost">See how it works</Link>
              </div>
              <div className="cx-ticker">
                <span className="d" />Clarity
                <span className="d" />Alignment
                <span className="d" />Decision speed
                <span className="d" />Accountability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="cx-prob cx-section" style={{ padding: "48px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }} data-animate="">
            <span className="no">(01)</span>
            <div>
              <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>The real problem</span>
              <h2 style={{ marginTop: 8 }}>Working hard, still stuck?</h2>
            </div>
          </div>
          <div className="cx-prob-list">
            {[
              "Decisions take too long",
              "The same issues keep returning",
              "Meetings don't move things forward",
              "Leaders firefight instead of lead",
            ].map((item, i) => (
              <div key={item} className="cx-prob-item" style={{ fontSize: "clamp(16px, 2vw, 28px)", paddingTop: "12px", paddingBottom: "12px" }} data-animate="" data-animate-delay={String(i * 120)}>
                <span className="n">0{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
          <p className="cx-prob-note" style={{ marginTop: 16 }} data-animate="" data-animate-delay="480">
            This is not a people problem. <b>It&apos;s how the work is set up.</b>
          </p>
        </div>
      </section>

      {/* ── Approach ── */}
      <section className="cx-section" id="approach" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no">(02)</span>
            <div>
              <span className="cx-eyebrow">Where we work</span>
              <h2 style={{ marginTop: 8 }}>Real change happens at the team level</h2>
            </div>
          </div>
          <div className="cx-split">
            <div className="cx-ph" style={{ aspectRatio: "4/3" }} data-animate="">
              <Image src="/team.jpg" alt="Team working together" fill style={{ objectFit: "cover" }} />
            </div>
            <div className="cx-steps" style={{ alignSelf: "stretch", justifyContent: "space-between" }}>
              {[
                { n: "01", h: "Diagnose what's in the way", p: "A practical read on how the team actually operates — not a theoretical model." },
                { n: "02", h: "Reset how decisions get made", p: "Clear priorities, ownership and decision rights that hold under pressure." },
                { n: "03", h: "Make the new way stick", p: "Support so performance becomes stable, not dependent on constant effort." },
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

      {/* ── Engagements ── */}
      <section className="cx-section" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no">(03)</span>
            <div>
              <span className="cx-eyebrow">What we do</span>
              <h2 style={{ marginTop: 8 }}>Four depths of engagement</h2>
            </div>
          </div>
          {[
            { dur: "1 Day",    h: "Team Reset",             p: "A focused, in-person offsite to reset how your team works — faster decisions, fewer repeated debates, shorter meetings." },
            { dur: "1 Month",  h: "Reset & Redesign",       p: "Reset and redesign how the team operates. Clear ownership, decisions made and held, friction reduced." },
            { dur: "3 Months", h: "Make It Stick",          p: "Embed new ways of working. Consistent decision-making, healthier disagreement, trust under pressure." },
            { dur: "6 Months", h: "Perform Under Pressure", p: "Shift how a critical team performs when it matters most. Sustained improvement, less dependence on constant effort." },
          ].map(({ dur, h, p }, i) => (
            <div key={h} className="cx-eng-row" style={{ paddingTop: "14px", paddingBottom: "14px" }} data-animate="" data-animate-delay={String(i * 150)}>
              <span className="dur">{dur}</span>
              <div><h3>{h}</h3><p>{p}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Results ── */}
      <section className="cx-results cx-section">
        <div className="cx-wrap">
          <div className="cx-label-row" data-animate="">
            <span className="no" style={{ color: "#fff" }}>(04)</span>
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
            Let&apos;s fix how<br />the work <span className="acc">works.</span>
          </h2>
          <p>
            Not sure where to start? We&apos;ll diagnose what&apos;s holding your team back
            and recommend a clear, practical way forward.
          </p>
          <Link href="/reach-out" className="cx-btn dark">Reach out to us →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
