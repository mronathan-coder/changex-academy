import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="cx-header">
      <div className="cx-wrap">
        <nav className="cx-nav">
          <Link href="/">
            <Image src="/logo.png" alt="Change_X — Academy of Business" height={52} width={178} style={{ height: 52, width: "auto" }} priority />
          </Link>
          <div className="cx-navlinks">
            <Link href="/" className="cx-nav-home">Home</Link>
            <Link href="/who-we-are" className="cx-nav-who">Who We Are</Link>
            <Link href="/what-we-do" className="cx-nav-what">What We Do</Link>
            <Link href="/coaching" className="cx-nav-coaching">Coaching</Link>
            <Link href="/insights" className="cx-nav-insights">Insights</Link>
            <Link href="/reach-out" className="cx-nav-reach">Reach Out</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
