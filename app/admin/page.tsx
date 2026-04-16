"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { uploadAssetFromBrowser } from "@/lib/client-upload";
import { emptyContent, mergeSiteContent, SiteContent } from "@/lib/data";

type Tab = "general" | "home" | "about" | "resume" | "portfolio" | "services" | "contact" | "testimonials" | "messages";

type Message = { _id: string; name: string; email: string; message: string; createdAt: string };

const tabs: { key: Tab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "resume", label: "Resume" },
  { key: "portfolio", label: "Portfolio" },
  { key: "services", label: "Services" },
  { key: "contact", label: "Contact" },
  { key: "testimonials", label: "Testimonials" },
  { key: "messages", label: "Messages" },
];

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [tab, setTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);

  // roles textarea helper
  const [rolesText, setRolesText] = useState("");

  useEffect(() => {
    axios.get<SiteContent>("/content")
      .then((res) => {
        const merged = mergeSiteContent(res.data);
        setContent(merged);
        setRolesText(merged.heroRoles.join("\n"));
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file: File, onDone: (url: string) => void) => {
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadAssetFromBrowser(file);
      onDone(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openPicker = (accept: string, multiple: boolean, onSelect: (files: File[]) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files ?? []);
      if (files.length) onSelect(files);
    };
    input.click();
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = mergeSiteContent({
        ...content,
        heroRoles: rolesText.split("\n").map((r) => r.trim()).filter(Boolean),
      });
      const { data } = await axios.post<SiteContent>("/content", payload);
      setContent(mergeSiteContent(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await axios.delete("/auth");
    router.push("/admin/login");
  };

  const update = (patch: Partial<SiteContent>) => setContent((c) => ({ ...c, ...patch }));

  const loadMessages = () => {
    setMsgsLoading(true);
    axios.get<Message[]>("/contact")
      .then((res) => setMessages(res.data))
      .catch(() => setError("Failed to load messages."))
      .finally(() => setMsgsLoading(false));
  };

  const inp = "w-full bg-[#0f172a] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-600";
  const lbl = "text-gray-400 text-xs mb-1 block";
  const field = "mb-4";

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <header className="bg-[#111827] px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div>
          <h1 className="text-lg font-bold">Portfolio Admin</h1>
          <p className="text-gray-500 text-xs">Manage your portfolio content</p>
        </div>
        <div className="flex gap-3 items-center">
          {uploading && <span className="text-xs text-cyan-400">Uploading...</span>}
          <a href="/" target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline px-3 py-2">View Site</a>
          <button onClick={save} disabled={saving || uploading} className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
          <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded transition-colors">Logout</button>
        </div>
      </header>

      {error && <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-3 text-sm text-red-300">{error}</div>}

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-44 bg-[#111827] border-r border-gray-800 flex flex-col py-4 gap-1 px-2 shrink-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(""); if (t.key === "messages") loadMessages(); }}
              className={`text-left px-3 py-2.5 rounded text-sm transition-colors ${tab === t.key ? "bg-cyan-500/20 text-cyan-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-[#1e2a3a]"}`}>
              {t.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? <p className="text-gray-500 text-sm">Loading...</p> : (
            <>
              {/* ── GENERAL ── */}
              {tab === "general" && (
                <div className="max-w-xl">
                  <h2 className="text-xl font-bold mb-6">General Settings</h2>
                  <div className={field}>
                    <label className={lbl}>Display Name</label>
                    <input className={inp} value={content.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div className={field}>
                    <label className={lbl}>Avatar Image</label>
                    <div className="flex items-center gap-4">
                      {content.avatar && <Image src={content.avatar} alt="avatar" width={60} height={60} className="rounded-full object-cover" unoptimized />}
                      <button onClick={() => fileRef.current?.click()} className="bg-[#1e2a3a] hover:bg-[#263548] text-sm px-4 py-2 rounded text-gray-300 transition-colors">Upload Avatar</button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f, (url) => update({ avatar: url })); e.target.value = ""; }} />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-400 mt-6 mb-4">Section Visibility</h3>
                  <div className="flex flex-col gap-2 mb-6">
                    {(["about", "resume", "portfolio", "services", "testimonials", "contact"] as const).map((key) => {
                      const hidden = content.hiddenSections.includes(key);
                      return (
                        <div key={key} className="flex items-center justify-between bg-[#0f172a] rounded px-4 py-2.5">
                          <span className="text-sm text-gray-300 capitalize">{key}</span>
                          <button
                            onClick={() => update({ hiddenSections: hidden ? content.hiddenSections.filter((s) => s !== key) : [...content.hiddenSections, key] })}
                            className={`text-xs px-3 py-1 rounded font-medium transition-colors ${ hidden ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30" }`}>
                            {hidden ? "Hidden" : "Visible"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-400 mt-6 mb-4">Social Links</h3>
                  {(["linkedin", "upwork", "github"] as const).map((key) => (
                    <div key={key} className={field}>
                      <label className={lbl}>{key.charAt(0).toUpperCase() + key.slice(1)} URL</label>
                      <input className={inp} value={content.socials[key]}
                        onChange={(e) => update({ socials: { ...content.socials, [key]: e.target.value } })}
                        placeholder={key === "linkedin" ? "https://linkedin.com/in/yourprofile" : key === "upwork" ? "https://upwork.com/freelancers/yourprofile" : "https://github.com/yourusername"} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── HOME ── */}
              {tab === "home" && (
                <div className="max-w-xl">
                  <h2 className="text-xl font-bold mb-6">Home Section</h2>
                  <div className={field}>
                    <label className={lbl}>Hero Name</label>
                    <input className={inp} value={content.heroName} onChange={(e) => update({ heroName: e.target.value })} placeholder="e.g. John Doe" />
                  </div>
                  <div className={field}>
                    <label className={lbl}>Background Image</label>
                    <div className="flex items-center gap-4">
                      {content.heroBg && <Image src={content.heroBg} alt="bg" width={120} height={60} className="rounded object-cover opacity-80" unoptimized />}
                      <button onClick={() => openPicker("image/*", false, ([f]) => { if (f) void handleUpload(f, (url) => update({ heroBg: url })); })}
                        className="bg-[#1e2a3a] hover:bg-[#263548] text-sm px-4 py-2 rounded text-gray-300 transition-colors">Upload Background</button>
                    </div>
                  </div>
                  <div className={field}>
                    <label className={lbl}>Typing Roles (one per line)</label>
                    <textarea className={`${inp} h-28 resize-none`} value={rolesText} onChange={(e) => setRolesText(e.target.value)} placeholder={"Developer\nDesigner\nFreelancer"} />
                  </div>
                </div>
              )}

              {/* ── ABOUT ── */}
              {tab === "about" && (
                <div className="max-w-xl">
                  <h2 className="text-xl font-bold mb-6">About Section</h2>
                  <div className={field}>
                    <label className={lbl}>Paragraph 1</label>
                    <textarea className={`${inp} h-24 resize-none`} value={content.aboutPara1} onChange={(e) => update({ aboutPara1: e.target.value })} />
                  </div>
                  <div className={field}>
                    <label className={lbl}>Paragraph 2</label>
                    <textarea className={`${inp} h-24 resize-none`} value={content.aboutPara2} onChange={(e) => update({ aboutPara2: e.target.value })} />
                  </div>
                </div>
              )}

              {/* ── RESUME ── */}
              {tab === "resume" && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold mb-6">Resume Section</h2>

                  <div className={field}>
                    <label className={lbl}>CV / Resume PDF</label>
                    <p className="text-gray-500 text-xs mb-2">PDF uploads up to 5 MB are supported.</p>
                    <div className="flex items-center gap-4">
                      {content.resumePdf && (
                        <a href={content.resumePdf} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">View current CV</a>
                      )}
                      <button onClick={() => openPicker("application/pdf", false, ([f]) => { if (f) void handleUpload(f, (url) => update({ resumePdf: url })); })}
                        className="bg-[#1e2a3a] hover:bg-[#263548] text-sm px-4 py-2 rounded text-gray-300 transition-colors">
                        {content.resumePdf ? "Replace PDF" : "Upload PDF"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 mt-6">
                    <h3 className="text-sm font-semibold text-cyan-400">Education</h3>
                    <button onClick={() => update({ education: [...content.education, { year: "", degree: "", institution: "" }] })}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/30">+ Add</button>
                  </div>
                  {content.education.map((item, i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-4 mb-3 flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {(["year", "degree", "institution"] as const).map((k) => (
                          <input key={k} className={inp} placeholder={k.charAt(0).toUpperCase() + k.slice(1)} value={item[k]}
                            onChange={(e) => { const next = [...content.education]; next[i] = { ...next[i], [k]: e.target.value }; update({ education: next }); }} />
                        ))}
                      </div>
                      <button onClick={() => { if (confirm("Delete this entry?")) update({ education: content.education.filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-lg mt-1">×</button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mb-4 mt-8">
                    <h3 className="text-sm font-semibold text-cyan-400">Experience</h3>
                    <button onClick={() => update({ experience: [...content.experience, { year: "", role: "", company: "" }] })}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/30">+ Add</button>
                  </div>
                  {content.experience.map((item, i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-4 mb-3 flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {(["year", "role", "company"] as const).map((k) => (
                          <input key={k} className={inp} placeholder={k.charAt(0).toUpperCase() + k.slice(1)} value={item[k]}
                            onChange={(e) => { const next = [...content.experience]; next[i] = { ...next[i], [k]: e.target.value }; update({ experience: next }); }} />
                        ))}
                      </div>
                      <button onClick={() => { if (confirm("Delete this entry?")) update({ experience: content.experience.filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-lg mt-1">×</button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mb-4 mt-8">
                    <h3 className="text-sm font-semibold text-cyan-400">Skills</h3>
                    <button onClick={() => update({ skills: [...content.skills, { name: "", pct: 80 }] })}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/30">+ Add</button>
                  </div>
                  {content.skills.map((skill, i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-4 mb-3 flex gap-3 items-center">
                      <input className={`${inp} flex-1`} placeholder="Skill name" value={skill.name}
                        onChange={(e) => { const next = [...content.skills]; next[i] = { ...next[i], name: e.target.value }; update({ skills: next }); }} />
                      <input type="number" min={0} max={100} className={`${inp} w-20`} value={skill.pct}
                        onChange={(e) => { const next = [...content.skills]; next[i] = { ...next[i], pct: Number(e.target.value) }; update({ skills: next }); }} />
                      <span className="text-gray-500 text-sm">%</span>
                      <button onClick={() => { if (confirm("Delete this skill?")) update({ skills: content.skills.filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-lg">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ── PORTFOLIO ── */}
              {tab === "portfolio" && (
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Portfolio Section</h2>
                    <button onClick={() => update({ projects: [...content.projects, { title: "", cat: "", image: "", link: "" }] })}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30">+ Add Project</button>
                  </div>
                  {content.projects.map((p, i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-4 mb-4">
                      <div className="flex gap-3 mb-3">
                        <input className={`${inp} flex-1`} placeholder="Title" value={p.title}
                          onChange={(e) => { const next = [...content.projects]; next[i] = { ...next[i], title: e.target.value }; update({ projects: next }); }} />
                        <input className={`${inp} w-36`} placeholder="Category" value={p.cat}
                          onChange={(e) => { const next = [...content.projects]; next[i] = { ...next[i], cat: e.target.value }; update({ projects: next }); }} />
                        <button onClick={() => { if (confirm("Delete this project?")) update({ projects: content.projects.filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-lg">×</button>
                      </div>
                      <div className="mb-3">
                        <input className={inp} placeholder="Project URL (optional)" value={p.link}
                          onChange={(e) => { const next = [...content.projects]; next[i] = { ...next[i], link: e.target.value }; update({ projects: next }); }} />
                      </div>
                      <div className="flex items-center gap-3">
                        {p.image && <Image src={p.image} alt={p.title} width={64} height={48} className="w-16 h-12 object-cover rounded" unoptimized />}
                        <button onClick={() => openPicker("image/*", false, ([f]) => { if (f) void handleUpload(f, (url) => { const next = [...content.projects]; next[i] = { ...next[i], image: url }; update({ projects: next }); }); })}
                          className="bg-[#1e2a3a] hover:bg-[#263548] text-xs px-3 py-1.5 rounded text-gray-300 transition-colors">
                          {p.image ? "Change Image" : "Upload Image"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── SERVICES ── */}
              {tab === "services" && (
                <div className="max-w-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Services Section</h2>
                    <button onClick={() => update({ services: [...content.services, { title: "", desc: "" }] })}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30">+ Add Service</button>
                  </div>
                  {content.services.map((s, i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-4 mb-4">
                      <div className="flex gap-2 mb-2">
                        <input className={`${inp} flex-1`} placeholder="Service title" value={s.title}
                          onChange={(e) => { const next = [...content.services]; next[i] = { ...next[i], title: e.target.value }; update({ services: next }); }} />
                        <button onClick={() => { if (confirm("Delete this service?")) update({ services: content.services.filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-lg px-1">×</button>
                      </div>
                      <textarea className={`${inp} h-20 resize-none`} placeholder="Description" value={s.desc}
                        onChange={(e) => { const next = [...content.services]; next[i] = { ...next[i], desc: e.target.value }; update({ services: next }); }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── MESSAGES ── */}
              {tab === "messages" && (
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Inbox <span className="text-cyan-400">Messages</span></h2>
                    <button onClick={loadMessages} className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30">Refresh</button>
                  </div>
                  {msgsLoading && <p className="text-gray-500 text-sm">Loading...</p>}
                  {!msgsLoading && messages.length === 0 && (
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                      <p className="text-gray-500 text-sm">No messages yet.</p>
                      <p className="text-gray-600 text-xs mt-1">Messages sent from the contact form will appear here.</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                      <div key={msg._id} className="bg-[#111827] rounded-xl p-5 border border-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-white">{msg.name}</p>
                            <a href={`mailto:${msg.email}`} className="text-cyan-400 text-xs hover:underline">{msg.email}</a>
                          </div>
                          <span className="text-gray-600 text-xs">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <a href={`mailto:${msg.email}?subject=Re: Your message`}
                          className="inline-block mt-3 text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/30 transition-colors">
                          Reply via Email
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CONTACT ── */}
              {tab === "contact" && (
                <div className="max-w-xl">
                  <h2 className="text-xl font-bold mb-6">Contact / Footer</h2>
                  <div className={field}>
                    <label className={lbl}>Phone</label>
                    <input className={inp} type="tel" value={content.contactPhone} onChange={(e) => update({ contactPhone: e.target.value })} placeholder="+1 234 567 890" />
                  </div>
                  <div className={field}>
                    <label className={lbl}>Email</label>
                    <input className={inp} type="email" value={content.contactEmail} onChange={(e) => update({ contactEmail: e.target.value })} placeholder="you@example.com" />
                  </div>
                </div>
              )}

              {/* ── TESTIMONIALS ── */}
              {tab === "testimonials" && (
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Testimonials</h2>
                      <p className="text-gray-500 text-xs mt-1">Upload images, videos, or PDFs. PDF files can be up to 5 MB.</p>
                    </div>
                    <button
                      onClick={() => openPicker("image/*,video/*,application/pdf", true, async (files) => {
                        setUploading(true);
                        setError("");
                        try {
                          const uploaded: SiteContent["testimonials"] = [];
                          for (const file of files) {
                            const asset = await uploadAssetFromBrowser(file);
                            uploaded.push({ title: file.name.replace(/\.[^.]+$/, ""), type: asset.type, url: asset.url, caption: "" });
                          }
                          update({ testimonials: [...(content.testimonials ?? []), ...uploaded] });
                        } catch (error) {
                          setError(error instanceof Error ? error.message : "Upload failed. Please try again.");
                        } finally {
                          setUploading(false);
                        }
                      })}
                      className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                      + Upload Files
                    </button>
                  </div>

                  {(content.testimonials ?? []).length === 0 && (
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                      <p className="text-gray-500 text-sm">No files uploaded yet.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(content.testimonials ?? []).map((t, i) => (
                      <div key={i} className="bg-[#111827] rounded-xl overflow-hidden">
                        <div className="h-36 bg-[#1e2a3a] flex items-center justify-center relative">
                          {t.type === "image" && <Image src={t.url} alt={t.title} fill sizes="50vw" className="object-cover" unoptimized />}
                          {t.type === "video" && <video src={t.url} className="w-full h-full object-cover opacity-70" />}
                          {t.type === "pdf" && <div className="flex flex-col items-center gap-1"><span className="text-red-400 text-4xl">PDF</span><span className="text-gray-400 text-xs">Document</span></div>}
                          <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${t.type === "image" ? "bg-cyan-500/80" : t.type === "video" ? "bg-purple-500/80" : "bg-red-500/80"} text-white`}>{t.type}</span>
                        </div>
                        <div className="p-3 flex flex-col gap-2">
                          <input className={inp} placeholder="Title" value={t.title}
                            onChange={(e) => { const next = [...(content.testimonials ?? [])]; next[i] = { ...next[i], title: e.target.value }; update({ testimonials: next }); }} />
                          <div className="flex gap-2">
                            <textarea className={`${inp} h-14 resize-none flex-1`} placeholder="Caption (optional)" value={t.caption}
                              onChange={(e) => { const next = [...(content.testimonials ?? [])]; next[i] = { ...next[i], caption: e.target.value }; update({ testimonials: next }); }} />
                            <button onClick={() => { if (confirm("Delete this item?")) update({ testimonials: (content.testimonials ?? []).filter((_, idx) => idx !== i) }); }} className="text-red-400 hover:text-red-300 text-xl px-2">×</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
