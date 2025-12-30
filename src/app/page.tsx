import { getLandingPageData } from "@/lib/queries";
import { Navigation } from "@/components/sections/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";

// Generate metadata from Sanity SEO data
export async function generateMetadata(): Promise<Metadata> {
  const data = await getLandingPageData();

  return {
    title: data.seo?.title || "MarketLinter - Stop building products nobody wants",
    description:
      data.seo?.description ||
      "Validate your startup idea in minutes. Scan real conversations to see if people actually have the problem you're solving.",
    openGraph: {
      title: data.seo?.title || "MarketLinter - Stop building products nobody wants",
      description:
        data.seo?.description ||
        "Market research that runs like a linter. Validate your idea before you build.",
      type: "website",
    },
  };
}

export default async function Home() {
  const data = await getLandingPageData();

  return (
    <>
      <Navigation />

      <main>
        {/* Hero Section */}
        {data.heroSection && <HeroSection data={data.heroSection} />}

        {/* Problem Section */}
        {data.problemSection && <ProblemSection data={data.problemSection} />}

        {/* Solution Section */}
        {data.solutionSection && <SolutionSection data={data.solutionSection} />}

        {/* How It Works Section */}
        {data.howItWorksSection && (
          <HowItWorksSection data={data.howItWorksSection} />
        )}

        {/* Pricing Section */}
        {data.pricingSection && data.pricingTiers && (
          <PricingSection data={data.pricingSection} tiers={data.pricingTiers} />
        )}

        {/* CTA Section */}
        {data.ctaSection && <CTASection data={data.ctaSection} />}
      </main>

      {/* Footer */}
      {data.footerSection && <Footer data={data.footerSection} />}
    </>
  );
}
