"use client";
import { useEffect, useRef } from "react";

export default function TypingText({ roles }: { roles: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!roles?.length) return;
    let roleIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const current = roles[roleIdx];
      if (el.current) el.current.textContent = current.slice(0, charIdx);
      if (!deleting && charIdx < current.length) { charIdx++; setTimeout(tick, 100); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1500); }
      else if (deleting && charIdx > 0) { charIdx--; setTimeout(tick, 60); }
      else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(tick, 300); }
    };
    tick();
  }, [roles]);

  return (
    <p className="text-white text-lg md:text-xl mt-3">
      I&apos;m <span ref={el} className="text-cyan-400 border-r-2 border-cyan-400 pr-0.5" />
    </p>
  );
}
