"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaLinkedinIn,
  FaHouse, FaUser, FaFileLines, FaBriefcase, FaLayerGroup, FaStar,
  FaEnvelope, FaBars, FaXmark,
} from "react-icons/fa6";
import { SiUpwork } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { SiteContent } from "@/lib/data";

const navItems = [
  { icon: FaHouse,      label: "Home",         href: "#home" },
  { icon: FaUser,       label: "About",        href: "#about" },
  { icon: FaFileLines,  label: "Resume",       href: "#resume" },
  { icon: FaBriefcase,  label: "Portfolio",    href: "#portfolio" },
  { icon: FaLayerGroup, label: "Services",     href: "#services" },
  { icon: FaStar,       label: "Testimonials", href: "#testimonials" },
  { icon: FaEnvelope,   label: "Contact",      href: "#contact" },
];

const socialIcons = [FaLinkedinIn, SiUpwork, FaGithub];
const socialKeys = ["linkedin", "upwork", "github"] as const;

export default function Sidebar({ content }: { content: SiteContent }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleNav = () => setMobileOpen(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1f2e] p-2.5 rounded-lg text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#111827] z-40 flex flex-col py-8 px-5 transition-transform duration-300 border-r border-gray-800/50 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-lg shadow-cyan-400/10">
              {content.avatar ? (
                <Image src={content.avatar} alt={content.name} width={80} height={80} className="object-cover w-full h-full" unoptimized />
              ) : (
                <div className="w-full h-full bg-[#1e2a3a]" />
              )}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#111827]" />
          </div>
          <h2 className="text-white font-bold text-base text-center leading-tight">{content.name}</h2>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 mb-5" />

        {/* Social icons */}
        <div className="flex gap-2 justify-center mb-6">
          {socialKeys.map((key, i) => {
            const Icon = socialIcons[i];
            return (
              <a key={key} href={content.socials[key] || "#"} target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1e2a3a] flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-[#263548] transition-all duration-200 text-xs">
                <Icon size={13} />
              </a>
            );
          })}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.filter(({ href }) => !content.hiddenSections.includes(href.slice(1))).map(({ icon: Icon, label, href }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <a key={label} href={href} onClick={handleNav}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive ? "nav-active font-semibold text-cyan-400" : "text-gray-400 hover:text-white hover:bg-[#1e2a3a]"
                }`}>
                <Icon className={isActive ? "text-cyan-400" : "text-gray-600 group-hover:text-cyan-400"} size={14} />
                {label}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-600 text-xs text-center">© {new Date().getFullYear()} {content.name}</p>
        </div>
      </aside>
    </>
  );
}
