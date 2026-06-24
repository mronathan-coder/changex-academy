"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-animate]")
      );
      if (elements.length === 0) return;

      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.animateDelay ?? "0", 10);
            setTimeout(() => el.classList.add("cx-anim-in"), delay);
            obs.unobserve(el);
          });
        },
        { threshold: 0.15, rootMargin: "-50px" }
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("cx-anim-in");
          return;
        }
        if (el.dataset.animate === "from-left") {
          el.classList.add("cx-anim-from-left");
        }
        el.classList.add("cx-anim-ready");
        observer!.observe(el);
      });
    };

    // Wait for Next.js App Router to finish rendering the new page into the DOM
    const id = setTimeout(setup, 80);

    return () => {
      clearTimeout(id);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
