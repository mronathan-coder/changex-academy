import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SubscribeModal from "../components/SubscribeModal";

export const metadata: Metadata = {
  title: "Insights | Change_X Academy of Business",
  description: "Practical perspectives on team performance, leadership, and the real reasons organisations stall.",
};

const articles = [
  {
    cat: "Team performance",
    title: "Why most team offsites don't change anything",
    summary:
      "A two-day offsite with a great facilitator. Everyone leaves energised. Six weeks later, nothing has changed. Here's why — and what to do instead.",
    date: "June 2025",
    slug: "#",
  },
  {
    cat: "Decision-making",
    title: "The hidden cost of slow decisions",
    summary:
      "It's rarely the big decisions that stall teams. It's the medium ones — the ones that get deferred, revisited, and debated again and again until the energy runs out.",
    date: "May 2025",
    slug: "#",
  },
  {
    cat: "Leadership",
    title: "You're not the problem. The setup is.",
    summary:
      "Leaders often blame themselves when their team underperforms. But low performance is almost never a people problem. It's a structural one — and it's fixable.",
    date: "April 2025",
    slug: "#",
  },
  {
    cat: "Team performance",
    title: "Accountability without blame: how high-performing teams disagree",
    summary:
      "The teams that perform best aren't the ones that never disagree. They're the ones that have learned to disagree well — and still hold each other to account.",
    date: "March 2025",
    slug: "#",
  },
  {
    cat: "Coaching",
    title: "What good leadership coaching actually looks like",
    summary:
      "Most leaders have experienced coaching that felt good but changed nothing. Here's what separates the sessions that shift behaviour from the ones that don't.",
    date: "February 2025",
    slug: "#",
  },
  {
    cat: "Decision-making",
    title: "The one conversation every leadership team avoids — and needs to have",
    summary:
      "Priorities. Every team claims to have them. Almost none have actually agreed on them in a way that guides real decisions under pressure.",
    date: "January 2025",
    slug: "#",
  },
];

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
          <div className="cx-hero-foot" style={{ gridTemplateColumns: "minmax(0, 44ch) 1fr" }}>
            <p className="lede">
              Practical perspectives on team performance, leadership, and the
              real reasons organisations stall — and what to do about it.
            </p>
            <div className="right">
              <div className="cta">
                <Link href="#articles" className="cx-btn">Read the latest →</Link>
                <Link href="#articles" className="cx-btn ghost">See all insights</Link>
              </div>
              <div className="cx-ticker">
                <span className="d" />Team performance
                <span className="d" />Leadership
                <span className="d" />Decision-making
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="cx-section" id="articles" style={{ padding: "36px 0" }}>
        <div className="cx-wrap">
          <div className="cx-label-row" style={{ marginBottom: 14 }}>
            <span className="no">(01)</span>
            <div>
              <span className="cx-eyebrow">Latest thinking</span>
              <h2 style={{ marginTop: 8 }}>Recent articles</h2>
            </div>
          </div>
          {articles.map(({ cat, title, summary, date, slug }) => (
            <Link href={slug} key={title} className="cx-article-row" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
              <div className="cx-article-meta">
                <span className="cx-eyebrow" style={{ color: "var(--accent)" }}>{cat}</span>
                <span className="cx-article-date">{date}</span>
              </div>
              <div className="cx-article-body">
                <h3>{title}</h3>
                <p>{summary}</p>
              </div>
              <span className="go">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cx-cta" id="cta">
        <div className="cx-wrap">
          <h2 className="cx-display">
            Want these<br />in your <span className="acc">inbox?</span>
          </h2>
          <p>
            We publish new thinking every month. No noise — just practical
            perspectives on how teams perform.
          </p>
          <SubscribeModal />
        </div>
      </section>

      <Footer />
    </>
  );
}
