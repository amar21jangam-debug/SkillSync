import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Fade-in + slide-up reveal for elements with [data-reveal]
export function useReveal(deps = []) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power2.out" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return containerRef;
}

export function animateNumber(el, from, to, duration = 1.1) {
  const obj = { v: from };
  return gsap.to(obj, {
    v: to, duration, ease: "power2.out",
    onUpdate: () => { if (el) el.textContent = Math.round(obj.v); },
  });
}

export function popIn(el) {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.4, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
  );
}
