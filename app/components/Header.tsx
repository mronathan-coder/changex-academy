"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="cx-header">
      <div className="cx-wrap">
        <nav className="cx-nav">
          <Link href="/" onClick={close}>
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
          <Link href="/dashboard" className="cx-nav-login">Team Login</Link>
          <button
            className="cx-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>
        </nav>
      </div>
      {open && (
        <div className="cx-mobile-menu">
          <div className="cx-wrap">
            <Link href="/" className="cx-nav-home" onClick={close}>Home</Link>
            <Link href="/who-we-are" className="cx-nav-who" onClick={close}>Who We Are</Link>
            <Link href="/what-we-do" className="cx-nav-what" onClick={close}>What We Do</Link>
            <Link href="/coaching" className="cx-nav-coaching" onClick={close}>Coaching</Link>
            <Link href="/insights" className="cx-nav-insights" onClick={close}>Insights</Link>
            <Link href="/reach-out" className="cx-nav-reach" onClick={close}>Reach Out</Link>
            <Link href="/dashboard" className="cx-nav-login" onClick={close}>Team Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}
