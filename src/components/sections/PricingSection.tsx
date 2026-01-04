"use client";

import { motion, stagger, useReducedMotion } from "motion/react";
import type {
  PricingSection as PricingSectionData,
  PricingTier,
} from "@/types/sanity";

interface PricingSectionProps {
  data: PricingSectionData;
  tiers: PricingTier[];
}

// Animation variants for staggered card reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: stagger(0.15),
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function PricingSection({ data, tiers }: PricingSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="pricing" className="border-t border-slate-800 px-6 py-24">
      <div className="mx-auto max-w-[1140px]">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-green">
            {data.label}
          </p>
          <h2 className="text-[clamp(32px,4vw,40px)] font-bold leading-tight tracking-[-0.02em] text-white">
            {data.title}
          </h2>

          {/* Early Access Badge */}
          {data.showEarlyAccessBadge && (
            <motion.div
              className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green/10 px-3 py-1.5 text-xs font-semibold text-green"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              // Subtle pulse animation
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      boxShadow: [
                        "0 0 5px rgba(16, 185, 129, 0.2)",
                        "0 0 20px rgba(16, 185, 129, 0.4)",
                        "0 0 5px rgba(16, 185, 129, 0.2)",
                      ],
                    }
              }
              {...(!shouldReduceMotion && {
                transition: {
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              })}
            >
              <span>🎉</span>
              {data.earlyAccessBadgeText}
            </motion.div>
          )}
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier._id}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -8,
                      boxShadow: tier.isFeatured
                        ? "0 0 60px rgba(16,185,129,0.2), 0 20px 40px rgba(0,0,0,0.3)"
                        : "0 20px 40px rgba(0,0,0,0.3)",
                    }
              }
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={`relative rounded-xl border p-8 ${
                tier.isFeatured
                  ? "border-green bg-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              {/* Featured Badge */}
              {tier.isFeatured && (
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-950"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  Most Popular
                </motion.div>
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
                  <motion.li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : { x: 4, transition: { type: "spring", stiffness: 300 } }
                    }
                  >
                    <span className="flex-shrink-0 font-semibold text-green">
                      ✓
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                className={`btn-shine block w-full rounded-lg py-3 text-center text-sm font-semibold ${
                  tier.isFeatured
                    ? "bg-green text-slate-950"
                    : "border border-slate-600 bg-transparent text-slate-300"
                }`}
                onClick={() => {
                  const waitlistForm = document.getElementById("waitlist-form");
                  if (waitlistForm) {
                    waitlistForm.scrollIntoView({ behavior: "smooth", block: "center" });
                    // Focus the email input for better UX
                    const emailInput = waitlistForm.querySelector<HTMLInputElement>('input[type="email"]');
                    if (emailInput) {
                      setTimeout(() => emailInput.focus(), 500);
                    }
                  }
                }}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -2,
                        boxShadow: tier.isFeatured
                          ? "0 4px 12px var(--green-glow)"
                          : "0 4px 12px rgba(0,0,0,0.2)",
                        backgroundColor: tier.isFeatured
                          ? "var(--green-dark)"
                          : "var(--slate-800)",
                        borderColor: tier.isFeatured ? undefined : "var(--slate-500)",
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.97, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                {tier.ctaText}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
