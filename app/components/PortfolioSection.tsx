"use client";
import { useState } from "react";
import Image from "next/image";
import { SiteContent } from "@/lib/data";
import { useInView } from "../hooks/useInView";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const bgColors = ["bg-cyan-900", "bg-slate-700", "bg-indigo-900", "bg-teal-900", "bg-blue-900", "bg-gray-700"];

export default function PortfolioSection({ content }: { content: SiteContent }) {
  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(content.projects.map((p) => p.cat).filter(Boolean)))];
  const filtered = activeFilter === "All" ? content.projects : content.projects.filter((p) => p.cat === activeFilter);

  return (
    <section ref={ref} id="portfolio" className="min-h-screen bg-[#0f172a] text-white px-8 md:px-20 py-20">
      <p className={`text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2 fade-up ${inView ? "in-view" : ""}`}>My Work</p>
      <h2 className={`text-4xl font-bold mb-3 fade-up delay-100 ${inView ? "in-view" : ""}`}>Portfolio</h2>
      <div className={`title-bar mb-8 ${inView ? "in-view" : ""}`} />

      {/* Filter pills */}
      {categories.length > 1 && (
        <div className={`flex flex-wrap gap-2 mb-10 fade-up delay-200 ${inView ? "in-view" : ""}`}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                  : "bg-[#1e2a3a] text-gray-400 hover:text-white hover:bg-[#263548]"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && <p className="text-gray-500 text-sm">No projects yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => {
          const card = (
            <div className={`zoom-in-up delay-${(i % 6) * 100} ${inView ? "in-view" : ""} ${bgColors[i % bgColors.length]} rounded-xl h-56 overflow-hidden relative group card-hover`}>
              {p.image && (
                <Image src={p.image} alt={p.title} fill className="object-cover opacity-70 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500" unoptimized />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">{p.cat}</p>
                <h3 className="font-bold text-lg text-white">{p.title}</h3>
              </div>
              {/* Link icon */}
              {p.link && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaArrowUpRightFromSquare size={12} className="text-black" />
                  </span>
                </div>
              )}
            </div>
          );

          return p.link ? (
            <a key={i} href={p.link} target="_blank" rel="noreferrer">{card}</a>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
