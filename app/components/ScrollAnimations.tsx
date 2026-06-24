"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    let observer: IntersectionObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const setup = (attempt: number) => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-animate]")
      );

      // Retry up to 5 times at 80ms intervals if page content isn't in DOM yet
      if (elements.length === 0) {
        if (attempt < 5) {
          timeoutId = setTimeout(() => setup(attempt + 1), 80);
        }
        return;
      }

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

    timeoutId = setTimeout(() => setup(0), 80);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
