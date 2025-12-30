import { client } from "@/sanity/client";
import type {
  LandingPage,
  PricingTier,
  HeroSection,
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  PricingSection,
  CTASection,
  FooterSection,
  SEO,
} from "@/types/sanity";

// GROQ query to fetch the homepage with all sections
const homepageQuery = `*[_type == "page" && isHomepage == true][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  isHomepage,
  sections,
  seo
}`;

// GROQ query to fetch pricing tiers ordered by display order
const pricingTiersQuery = `*[_type == "pricingTier"] | order(order asc){
  _id,
  _type,
  name,
  price,
  billingPeriod,
  description,
  features,
  isFeatured,
  ctaText,
  order
}`;

// Fetch homepage data from Sanity
export async function getHomepageData(): Promise<LandingPage> {
  const data = await client.fetch<LandingPage>(homepageQuery);

  if (!data) {
    throw new Error("Homepage not found in Sanity CMS");
  }

  return data;
}

// Fetch pricing tiers from Sanity
export async function getPricingTiers(): Promise<PricingTier[]> {
  const data = await client.fetch<PricingTier[]>(pricingTiersQuery);
  return data || [];
}

// Helper function to extract a specific section from the page
export function getSection<T>(
  sections: LandingPage["sections"],
  type: string
): T | undefined {
  return sections.find((section) => section._type === type) as T | undefined;
}

// Get all landing page data in one call
export async function getLandingPageData() {
  const [homepage, pricingTiers] = await Promise.all([
    getHomepageData(),
    getPricingTiers(),
  ]);

  const heroSection = getSection<HeroSection>(homepage.sections, "heroSection");
  const problemSection = getSection<ProblemSection>(
    homepage.sections,
    "problemSection"
  );
  const solutionSection = getSection<SolutionSection>(
    homepage.sections,
    "solutionSection"
  );
  const howItWorksSection = getSection<HowItWorksSection>(
    homepage.sections,
    "howItWorksSection"
  );
  const pricingSection = getSection<PricingSection>(
    homepage.sections,
    "pricingSection"
  );
  const ctaSection = getSection<CTASection>(homepage.sections, "ctaSection");
  const footerSection = getSection<FooterSection>(
    homepage.sections,
    "footerSection"
  );

  return {
    seo: homepage.seo as SEO,
    heroSection,
    problemSection,
    solutionSection,
    howItWorksSection,
    pricingSection,
    pricingTiers,
    ctaSection,
    footerSection,
  };
}

export type LandingPageData = Awaited<ReturnType<typeof getLandingPageData>>;
