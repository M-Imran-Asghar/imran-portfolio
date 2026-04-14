"use client";
import { SiteContent } from "@/lib/data";
import { useInView } from "../hooks/useInView";
import { FaDownload, FaBriefcase, FaGraduationCap } from "react-icons/fa6";

export default function ResumeSection({ content }: { content: SiteContent }) {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} id="resume" className="min-h-screen bg-[#111827] text-white px-8 md:px-20 py-20">
      <div className={`flex items-center justify-between mb-3 fade-up ${inView ? "in-view" : ""}`}>
        <div>
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-1">My Background</p>
          <h2 className="text-4xl font-bold">Resume</h2>
        </div>
        {content.resumePdf && (
          <a href={content.resumePdf} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-cyan-500/30">
            <FaDownload size={13} /> Download CV
          </a>
        )}
      </div>
      <div className={`title-bar mb-12 ${inView ? "in-view" : ""}`} />

      <div className="grid md:grid-cols-2 gap-12">
        {/* Education */}
        {content.education.length > 0 && (
          <div className={`fade-left ${inView ? "in-view" : ""}`}>
            <div className="flex items-center gap-2 mb-6">
              <FaGraduationCap className="text-cyan-400" size={20} />
              <h3 className="text-xl font-semibold text-cyan-400">Education</h3>
            </div>
            {content.education.map((e, i) => (
              <div key={i} className="relative pl-6 mb-8 group">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-cyan-400 glow-pulse" />
                <div className="absolute left-1.5 top-4 bottom-0 w-px bg-gray-700 group-last:hidden" />
                <span className="text-xs text-cyan-400 font-semibold">{e.year}</span>
                <h4 className="font-semibold text-white mt-0.5">{e.degree}</h4>
                <p className="text-gray-400 text-sm">{e.institution}</p>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <div className={`fade-right ${inView ? "in-view" : ""}`}>
            <div className="flex items-center gap-2 mb-6">
              <FaBriefcase className="text-cyan-400" size={18} />
              <h3 className="text-xl font-semibold text-cyan-400">Experience</h3>
            </div>
            {content.experience.map((e, i) => (
              <div key={i} className="relative pl-6 mb-8 group">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-cyan-400 glow-pulse" />
                <div className="absolute left-1.5 top-4 bottom-0 w-px bg-gray-700 group-last:hidden" />
                <span className="text-xs text-cyan-400 font-semibold">{e.year}</span>
                <h4 className="font-semibold text-white mt-0.5">{e.role}</h4>
                <p className="text-gray-400 text-sm">{e.company}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills — full width if no edu/exp columns */}
        {content.skills.length > 0 && (
          <div className={`${content.education.length === 0 && content.experience.length === 0 ? "md:col-span-2" : "md:col-span-2"} fade-up delay-200 ${inView ? "in-view" : ""}`}>
            <h3 className="text-xl font-semibold text-cyan-400 mb-6">Skills</h3>
            <div className="grid md:grid-cols-2 gap-x-12">
              {content.skills.map((s, i) => (
                <div key={s.name} className={`mb-5 fade-up delay-${Math.min((i + 2) * 100, 800)} ${inView ? "in-view" : ""}`}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-cyan-400 font-semibold">{s.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="skill-bar h-2 rounded-full transition-all duration-1000"
                      style={{ width: inView ? `${s.pct}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
