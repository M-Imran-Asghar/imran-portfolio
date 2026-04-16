import { readContentFromDb } from "@/lib/db-store";
import Sidebar from "./components/Sidebar";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ResumeSection from "./components/ResumeSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await readContentFromDb();

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
