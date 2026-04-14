"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { SiteContent } from "@/lib/data";
import { FaLinkedinIn, FaPhone, FaEnvelope } from "react-icons/fa6";
import { SiUpwork } from "react-icons/si";
import { FaGithub } from "react-icons/fa";

const socialIcons = [FaLinkedinIn, SiUpwork, FaGithub];
const socialKeys = ["linkedin", "upwork", "github"] as const;

export default function ContactSection({ content }: { content: SiteContent }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await axios.post("/contact", form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      if (isAxiosError(err)) {
        setError((err.response?.data as { error?: string })?.error ?? "Failed to send message.");
      } else {
        setError("Failed to send message.");
      }
    } finally {
      setSending(false);
    }
  };

  const inp = "w-full bg-[#0f172a] text-white rounded px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <footer id="contact" className="bg-[#111827] text-white border-t border-gray-800">
      {/* Contact Form */}
      <div className="px-8 md:px-20 py-16 border-b border-gray-800">
        <h2 className="text-3xl font-bold mb-2">Get In <span className="text-cyan-400">Touch</span></h2>
        <div className="w-12 h-1 bg-cyan-400 mb-8" />
        {sent ? (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-6 py-4 text-cyan-400 text-sm max-w-xl">
            Message sent! I&apos;ll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">
            <input className={inp} placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={inp} placeholder="Your Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <textarea className={`${inp} h-36 resize-none`} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={sending}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold py-3 rounded transition-colors w-fit px-8">
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-8 md:px-20 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{content.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Passionate about creating beautiful digital experiences.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Contact</h4>
              <div className="flex flex-col gap-3">
                {content.contactPhone && (
                  <a href={`tel:${content.contactPhone}`} className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    <FaPhone size={13} className="text-cyan-400 shrink-0" />{content.contactPhone}
                  </a>
                )}
                {content.contactEmail && (
                  <a href={`mailto:${content.contactEmail}`} className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    <FaEnvelope size={13} className="text-cyan-400 shrink-0" />{content.contactEmail}
                  </a>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Follow Me</h4>
              <div className="flex gap-3">
                {socialKeys.map((key, i) => {
                  const Icon = socialIcons[i];
                  return (
                    <a key={key} href={content.socials[key] || "#"} target="_blank" rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-[#1e2a3a] flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-[#263548] transition-colors">
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} {content.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
