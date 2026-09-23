import { useEffect } from "react";

/**
 * Port of the template's setupReveal(): observe every `.reveal-section`
 * and add `is-visible` when it scrolls into view (children start at
 * opacity:0 per the template CSS). Re-runs whenever `dep` changes
 * (i.e. on route changes).
 */
export function useReveal(dep: unknown) {
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");
    if (sections.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [dep]);
}
