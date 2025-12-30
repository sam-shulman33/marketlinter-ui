import { EmailForm } from "@/components/EmailForm";
import { ReportCard } from "@/components/ReportCard";
import type { HeroSection as HeroSectionData } from "@/types/sanity";

interface HeroSectionProps {
  data: HeroSectionData;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="hero-section relative px-6 pb-24 pt-36 text-center sm:pt-36">
      {/* Gradient background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[150%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-[1140px]">
        {/* Badge */}
        <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-[13px] text-slate-300 transition-all hover:border-green hover:bg-green/10">
          <span className="animate-pulse-dot h-2 w-2 rounded-full bg-green shadow-[0_0_8px_var(--green-glow)]" />
          {data.badge}
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up-delay-1 mx-auto mb-6 max-w-[800px] text-[clamp(40px,6vw,64px)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
          {data.headline}
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up-delay-2 mx-auto mb-10 max-w-[600px] text-lg leading-[1.7] text-slate-400">
          {data.subtitle}
        </p>

        {/* Email Form */}
        <div className="animate-fade-in-up-delay-3">
          <EmailForm
            placeholder={data.formPlaceholder}
            submitText={data.ctaButtonText}
            showNote={true}
            noteText={data.formNote}
            className="mx-auto"
          />
        </div>

        {/* Report Card Visual */}
        <div className="animate-fade-in-up-delay-4 mt-16">
          <ReportCard />
        </div>
      </div>
    </section>
  );
}
