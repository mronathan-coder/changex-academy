"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    let observer: IntersectionObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const setup = (attempt: number) => {
      if (cancelled) return;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-animate]")
      );

      if (elements.length === 0) {
        if (attempt < 5) {
          timeoutId = setTimeout(() => setup(attempt + 1), 80);
        }
        return;
      }

      // Reset every element to its hidden starting state
      elements.forEach((el) => {
        el.classList.remove("cx-in");
        el.style.transitionDelay = "0ms";
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              const delay = parseInt(el.dataset.animateDelay ?? "0", 10);
              el.style.transitionDelay = `${delay}ms`;
              el.classList.add("cx-in");
            } else {
              // Reset so the animation replays on next entry
              el.style.transitionDelay = "0ms";
              el.classList.remove("cx-in");
            }
          });
        },
        { threshold: 0.15 }
      );

      // Observe every element — no unobserve so animations retrigger
      elements.forEach((el) => observer!.observe(el));
    };

    timeoutId = setTimeout(() => setup(0), 80);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      observer?.disconnect();
      // Restore visibility on teardown so next page starts clean
      document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
        el.classList.remove("cx-in");
        el.style.transitionDelay = "";
      });
    };
  }, [pathname]);

  return null;
}
