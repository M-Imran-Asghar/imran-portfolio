"use client";
import Image from "next/image";
import { SiteContent } from "@/lib/data";
import { useInView } from "../hooks/useInView";

export default function AboutSection({ content }: { content: SiteContent }) {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} id="about" className="min-h-screen bg-[#0f172a] text-white flex items-center px-8 md:px-20 py-20">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">

        {/* Avatar side */}
        <div className={`flex justify-center fade-left ${inView ? "in-view" : ""}`}>
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-2xl scale-110" />
            <div className="relative w-64 h-72 md:w-80 md:h-96 rounded-2xl overflow-hidden border border-cyan-400/20 shadow-2xl">
              {content.avatar ? (
                <Image src={content.avatar} alt={content.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-[#1e2a3a] flex items-center justify-center">
                  <span className="text-gray-600 text-sm">No photo</span>
                </div>
              )}
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-cyan-500 text-black text-xs font-bold px-4 py-2 rounded-xl shadow-lg glow-pulse">
              Available for work
            </div>
          </div>
        </div>

        {/* Text side */}
        <div>
          <p className={`text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2 fade-up ${inView ? "in-view" : ""}`}>
            About Me
          </p>
          <h2 className={`text-4xl font-bold mb-3 fade-up delay-100 ${inView ? "in-view" : ""}`}>
            Who Am <span className="text-cyan-400">I?</span>
          </h2>
          <div className={`title-bar mb-6 ${inView ? "in-view" : ""}`} />
          <p className={`text-gray-400 leading-relaxed mb-4 fade-up delay-200 ${inView ? "in-view" : ""}`}>
            {content.aboutPara1}
          </p>
          <p className={`text-gray-400 leading-relaxed fade-up delay-300 ${inView ? "in-view" : ""}`}>
            {content.aboutPara2}
          </p>

          {/* CTA */}
          <div className={`mt-8 flex gap-4 fade-up delay-400 ${inView ? "in-view" : ""}`}>
            <a href="#contact"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
              Hire Me
            </a>
            <a href="#portfolio"
              className="border border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-300">
              My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
