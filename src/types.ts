/**
 * Portfolio Data Type Definitions
 */

export interface CaseStudySection {
  title: string;
  label?: 'fact' | 'analysis' | 'hypothetical' | 'framework' | 'limitations';
  body: string;
  bulletPoints?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  statusBadge: string;
  featured: boolean;
  summary: string;
  problem: string;
  methods: string[];
  keyOutput: string;
  liveUrl?: string | null;
  embedUrl?: string | null;
  toolUrl?: string | null;
  sections: CaseStudySection[];
  safeguardNotice: string;
}

export interface ExperienceData {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  responsibilities: string[];
  tags: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  location: string;
  period: string;
  details: string;
}

export interface CertificateData {
  title: string;
  issuer: string;
  platform: string;
  dateCompleted: string;
  credentialId?: string;
  verificationUrl?: string;
  summary: string;
}

export interface SkillGroup {
  name: string;
  description: string;
  skills: string[];
}

export interface PortfolioProfile {
  name: string;
  title: string;
  headline: string;
  location: string;
  email: string;
  linkedInUrl: string;
  cvUrl: string | null;
  targetRoles: string[];
  heroParagraph: string;
  aboutText: string[];
  disclaimer: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  projects: ProjectData[];
  experience: ExperienceData[];
  education: EducationData[];
  certificates: CertificateData[];
  skills: SkillGroup[];
}
