"use client";

import { useEffect, useRef } from "react";
import type {
  PricingSection as PricingSectionData,
  PricingTier,
} from "@/types/sanity";

interface PricingSectionProps {
  data: PricingSectionData;
  tiers: PricingTier[];
}

export function PricingSection({ data, tiers }: PricingSectionProps) {
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
    <section
      ref={sectionRef}
      id="pricing"
      className="border-t border-slate-800 px-6 py-24"
    >
      <div className="mx-auto max-w-[1140px]">
        {/* Header */}
        <div className="fade-in-up mb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-green">
            {data.label}
          </p>
          <h2 className="text-[clamp(32px,4vw,40px)] font-bold leading-tight tracking-[-0.02em] text-white">
            {data.title}
          </h2>

          {/* Early Access Badge */}
          {data.showEarlyAccessBadge && (
            <div className="animate-glow mt-8 inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green/10 px-3 py-1.5 text-xs font-semibold text-green">
              <span>🎉</span>
              {data.earlyAccessBadgeText}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="stagger-children mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier._id}
              className={`relative rounded-xl border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                tier.isFeatured
                  ? "border-green bg-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2),0_20px_40px_rgba(0,0,0,0.3)]"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              {/* Featured Badge */}
              {tier.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-950">
                  Most Popular
                </div>
              )}

              {/* Tier Name */}
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-slate-400">
                {tier.name}
              </div>

              {/* Price */}
              <div className="mb-1 text-[40px] font-bold text-white">
                ${tier.price}
                <span className="text-base font-normal text-slate-500">
                  /{tier.billingPeriod}
                </span>
              </div>

              {/* Description */}
              <p className="mb-6 text-sm text-slate-500">{tier.description}</p>

              {/* Features */}
              <ul className="mb-7 space-y-2">
                {tier.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-slate-300 transition-transform hover:translate-x-1"
                  >
                    <span className="flex-shrink-0 font-semibold text-green">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`btn-shine block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                  tier.isFeatured
                    ? "bg-green text-slate-950 hover:-translate-y-0.5 hover:bg-green-dark hover:shadow-[0_4px_12px_var(--green-glow)]"
                    : "border border-slate-600 bg-transparent text-slate-300 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
