export type SiteContent = {
  name: string;
  avatar: string;
  socials: { linkedin: string; upwork: string; github: string };
  heroName: string;
  heroBg: string;
  heroRoles: string[];
  aboutPara1: string;
  aboutPara2: string;
  contactPhone: string;
  contactEmail: string;
  resumePdf: string;
  education: { year: string; degree: string; institution: string }[];
  experience: { year: string; role: string; company: string }[];
  skills: { name: string; pct: number }[];
  projects: { title: string; cat: string; image: string; link: string }[];
  services: { title: string; desc: string }[];
  testimonials: { title: string; type: "image" | "video" | "pdf"; url: string; caption: string }[];
  hiddenSections: string[];
};

export const emptyContent: SiteContent = {
  name: "",
  avatar: "",
  socials: { linkedin: "", upwork: "", github: "" },
  heroName: "",
  heroBg: "",
  heroRoles: [],
  aboutPara1: "",
  aboutPara2: "",
  contactPhone: "",
  contactEmail: "",
  resumePdf: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  services: [],
  testimonials: [],
  hiddenSections: [],
};

export function mergeSiteContent(content?: Partial<SiteContent> | null): SiteContent {
  return {
    ...emptyContent,
    ...content,
    socials: { ...emptyContent.socials, ...(content?.socials ?? {}) },
    heroRoles: content?.heroRoles ?? [],
    education: content?.education ?? [],
    experience: content?.experience ?? [],
    skills: content?.skills ?? [],
    projects: content?.projects ?? [],
    services: content?.services ?? [],
    testimonials: content?.testimonials ?? [],
    hiddenSections: content?.hiddenSections ?? [],
  };
}
