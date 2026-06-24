import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="cx-footer">
      <div className="cx-wrap">
        <div className="cx-foot-top">
          <Link href="/">
            <Image src="/logo.png" alt="Change_X — Academy of Business" height={44} width={150} style={{ height: 44, width: "auto", opacity: 0.85 }} />
          </Link>
          <div className="cx-foot-links">
            <Link href="/who-we-are">Who We Are</Link>
            <Link href="/what-we-do">What We Do</Link>
            <Link href="/coaching">Coaching</Link>
            <Link href="/insights">Insights</Link>
            <Link href="#cta">Reach Out To Us</Link>
          </div>
        </div>
        <div className="cx-foot-bottom">
          © {new Date().getFullYear()} Change_X Academy of Business. Performance, rebuilt at the team level.
        </div>
      </div>
    </footer>
  );
}
