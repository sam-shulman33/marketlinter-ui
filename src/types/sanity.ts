// TypeScript types matching the Sanity CMS schema

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

// Hero Section
export interface HeroSection {
  _key: string;
  _type: "heroSection";
  badge: string;
  headline: string;
  subtitle: string;
  ctaButtonText: string;
  formPlaceholder: string;
  formNote: string;
}

// Problem Section
export interface ProblemItem {
  _key: string;
  title: string;
  description: string;
}

export interface ProblemSection {
  _key: string;
  _type: "problemSection";
  label: string;
  title: string;
  problems: ProblemItem[];
}

// Solution Section
export interface SolutionFeature {
  _key: string;
  icon: "check" | "grid" | "pulse";
  title: string;
  description: string;
}

export interface SolutionSection {
  _key: string;
  _type: "solutionSection";
  label: string;
  title: string;
  features: SolutionFeature[];
}

// How It Works Section
export interface Step {
  _key: string;
  title: string;
  description: string;
}

export interface HowItWorksSection {
  _key: string;
  _type: "howItWorksSection";
  label: string;
  title: string;
  steps: Step[];
}

// Pricing Section
export interface PricingTier {
  _id: string;
  _type: "pricingTier";
  name: string;
  price: number;
  billingPeriod: "mo" | "yr" | "once";
  description: string;
  features: string[];
  isFeatured: boolean;
  ctaText: string;
  order: number;
}

export interface PricingTierReference {
  _key: string;
  _ref: string;
  _type: "reference";
}

export interface PricingSection {
  _key: string;
  _type: "pricingSection";
  label: string;
  title: string;
  showEarlyAccessBadge: boolean;
  earlyAccessBadgeText: string;
  tiers: PricingTierReference[];
}

// CTA Section
export interface CTASection {
  _key: string;
  _type: "ctaSection";
  headline: string;
  subtitle: string;
  ctaButtonText: string;
  formPlaceholder: string;
  waitlistCount: number;
  socialProofText: string;
}

// Footer Section
export interface FooterLink {
  _key: string;
  text: string;
  url: string;
}

export interface FooterSection {
  _key: string;
  _type: "footerSection";
  copyrightText: string;
  links: FooterLink[];
}

// SEO
export interface SEO {
  title: string;
  description: string;
}

// Page Section Union Type
export type PageSection =
  | HeroSection
  | ProblemSection
  | SolutionSection
  | HowItWorksSection
  | PricingSection
  | CTASection
  | FooterSection;

// Landing Page Document
export interface LandingPage extends SanityDocument {
  _type: "page";
  title: string;
  slug: { current: string };
  isHomepage: boolean;
  sections: PageSection[];
  seo: SEO;
}

// Expanded Landing Page (with pricing tiers resolved)
export interface LandingPageExpanded extends LandingPage {
  pricingTiers: PricingTier[];
}
