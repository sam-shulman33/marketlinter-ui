"use client";

import { useEffect, useRef } from "react";
import type { HowItWorksSection as HowItWorksSectionData } from "@/types/sanity";

interface HowItWorksSectionProps {
  data: HowItWorksSectionData;
}

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const section = sectionRef.current;
    if (section) {
      const fadeElements = section.querySelectorAll(".fade-in-up, .stagger-children");
      fadeElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-slate-800 px-6 py-24">
      <div className="mx-auto max-w-[1140px]">
        {/* Header */}
        <div className="fade-in-up mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-green">
            {data.label}
          </p>
          <h2 className="text-[clamp(32px,4vw,40px)] font-bold leading-tight tracking-[-0.02em] text-white">
            {data.title}
          </h2>
        </div>

        {/* Steps */}
        <div className="stagger-children relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Progress line (desktop only) */}
          <div className="pointer-events-none absolute left-[50px] right-[50px] top-6 hidden h-0.5 bg-gradient-to-r from-slate-800 via-green to-slate-800 opacity-50 lg:block" />

          {data.steps.map((step, index) => (
            <div key={step._key} className="group relative">
              {/* Step Number */}
              <div className="mb-4 font-mono text-5xl font-bold leading-none text-slate-800 transition-colors duration-300 group-hover:text-green">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Title */}
              <h3 className="mb-2.5 text-xl font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
