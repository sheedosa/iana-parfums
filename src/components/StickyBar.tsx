import { useEffect, useState, type ReactNode, type RefObject } from "react";

/** Phone only: what you chose and the one action, pinned to the bottom while the real buttons are out of view.
    It steps aside when the real buttons or the footer are on screen, so it never covers either. */
export function StickyBar({ watch, label, children }: { watch: RefObject<HTMLElement | null>; label: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = watch.current, foot = document.querySelector("footer");
    if (!el || typeof IntersectionObserver === "undefined") return;
    let seen = true, footSeen = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.target === el) seen = e.isIntersecting; else footSeen = e.isIntersecting; }
      setShow(!seen && !footSeen);
    });
    io.observe(el);
    if (foot) io.observe(foot);
    return () => io.disconnect();
  }, [watch]);
  return <div role="region" aria-label={label} className="bar" data-show={show} inert={!show}>{children}</div>;
}
