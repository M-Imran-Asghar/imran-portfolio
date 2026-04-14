"use client";
import { SiteContent } from "@/lib/data";
import TypingText from "./TypingText";
import { FaChevronDown } from "react-icons/fa6";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 8,
}));

export default function HomeSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden group"
    >
      {/* Background image with hover zoom */}
      {content.heroBg && (
        <div
          className="absolute inset-0 bg-center bg-no-repeat transition-transform duration-700 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url('${content.heroBg}')`, backgroundSize: "85%" }}
        />
      )}
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-10px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-28 pl-10 md:pl-20">
        <p
          className="text-cyan-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3 opacity-0"
          style={{ animation: "fadeSlideUp 0.8s ease 0.1s forwards" }}
        >
          Welcome to my portfolio
        </p>
        <h1
          className="text-white text-5xl md:text-7xl font-bold leading-tight opacity-0"
          style={{ animation: "fadeSlideUp 1s ease 0.3s forwards" }}
        >
          {content.heroName}
        </h1>
        <div className="opacity-0" style={{ animation: "fadeSlideUp 1s ease 0.6s forwards" }}>
          <TypingText roles={content.heroRoles} />
        </div>
        <div className="opacity-0 mt-8" style={{ animation: "fadeSlideUp 1s ease 0.9s forwards" }}>
          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
          >
            Explore My Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60">
        <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
        <FaChevronDown className="text-cyan-400 bounce-down" size={14} />
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
