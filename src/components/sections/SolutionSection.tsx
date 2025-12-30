"use client";

import { useEffect, useRef } from "react";
import type { SolutionSection as SolutionSectionData } from "@/types/sanity";

interface SolutionSectionProps {
  data: SolutionSectionData;
}

// SVG icons for solution features
const icons = {
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-green transition-transform duration-300 group-hover:scale-110"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 3 6-6" />
    </svg>
  ),
  grid: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-green transition-transform duration-300 group-hover:scale-110"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  pulse: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-green transition-transform duration-300 group-hover:scale-110"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

export function SolutionSection({ data }: SolutionSectionProps) {
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

        {/* Solution Cards Grid */}
        <div className="stagger-children grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.features.map((feature) => (
            <div
              key={feature._key}
              className="group p-5 text-center transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="solution-icon-glow mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-900">
                {icons[feature.icon as keyof typeof icons] || icons.check}
              </div>

              {/* Title */}
              <h3 className="mb-2.5 text-lg font-semibold text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
