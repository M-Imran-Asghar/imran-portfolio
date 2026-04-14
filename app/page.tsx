"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { emptyContent, mergeSiteContent, SiteContent } from "@/lib/data";
import Sidebar from "./components/Sidebar";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ResumeSection from "./components/ResumeSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";

export default function Page() {
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<SiteContent>("/content")
      .then((res) => setContent(mergeSiteContent(res.data)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar content={content} />
      <main className="md:ml-[210px] flex-1">
        <HomeSection content={content} />
        {!content.hiddenSections.includes("about") && <AboutSection content={content} />}
        {!content.hiddenSections.includes("resume") && <ResumeSection content={content} />}
        {!content.hiddenSections.includes("portfolio") && <PortfolioSection content={content} />}
        {!content.hiddenSections.includes("services") && <ServicesSection content={content} />}
        {!content.hiddenSections.includes("testimonials") && <TestimonialsSection content={content} />}
        {!content.hiddenSections.includes("contact") && <ContactSection content={content} />}
      </main>
    </div>
  );
}
