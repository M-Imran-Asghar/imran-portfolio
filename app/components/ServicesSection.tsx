"use client";
import { FaBolt } from "react-icons/fa6";
import { SiteContent } from "@/lib/data";
import { useInView } from "../hooks/useInView";

export default function ServicesSection({ content }: { content: SiteContent }) {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} id="services" className="min-h-screen bg-[#111827] text-white px-8 md:px-20 py-20">
      <p className={`text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2 fade-up ${inView ? "in-view" : ""}`}>What I Offer</p>
      <h2 className={`text-4xl font-bold mb-3 fade-up delay-100 ${inView ? "in-view" : ""}`}>Services</h2>
      <div className={`title-bar mb-12 ${inView ? "in-view" : ""}`} />

      {content.services.length === 0 && <p className="text-gray-500 text-sm">No services added yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {content.services.map((s, i) => (
          <div key={i}
            className={`zoom-in-up delay-${(i + 1) * 100} ${inView ? "in-view" : ""} relative bg-[#0f172a] border border-gray-800 rounded-2xl p-7 card-hover group overflow-hidden`}>
            {/* Background number */}
            <span className="absolute top-4 right-5 text-6xl font-black text-gray-800/40 select-none group-hover:text-cyan-400/10 transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition-colors">
              <FaBolt className="text-cyan-400" size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-400 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
