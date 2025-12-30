"use client";

import { useEffect, useRef } from "react";
import type { ProblemSection as ProblemSectionData } from "@/types/sanity";

interface ProblemSectionProps {
  data: ProblemSectionData;
}

export function ProblemSection({ data }: ProblemSectionProps) {
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
    <section ref={sectionRef} className="border-t border-slate-800 px-6 py-24 sm:py-24">
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

        {/* Problem Cards Grid */}
        <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.problems.map((problem) => (
            <div
              key={problem._key}
              className="problem-card-border rounded-xl border border-slate-800 bg-slate-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
            >
              <h3 className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-white">
                <span className="text-sm text-red transition-transform group-hover:rotate-90">
                  ✗
                </span>
                {problem.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-400">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
