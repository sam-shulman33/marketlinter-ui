"use client";

import { useEffect, useRef, useState } from "react";
import { EmailForm } from "@/components/EmailForm";
import type { CTASection as CTASectionData } from "@/types/sanity";

interface CTASectionProps {
  data: CTASectionData;
}

// Animated counter component
function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();

    function animateCount() {
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setCount(target);
        }
      }

      requestAnimationFrame(update);
    }
  }, [target, duration]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}
    </span>
  );
}

export function CTASection({ data }: CTASectionProps) {
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
      const fadeElements = section.querySelectorAll(".fade-in-up");
      fadeElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cta-pulse-bg border-t border-slate-800 px-6 py-24 text-center"
    >
      <div className="relative mx-auto max-w-[1140px]">
        {/* Headline */}
        <h2 className="fade-in-up mb-4 text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-[-0.02em] text-white">
          {data.headline}
        </h2>

        {/* Subtitle */}
        <p className="fade-in-up mb-8 text-lg text-slate-400">
          {data.subtitle}
        </p>

        {/* Email Form */}
        <div className="fade-in-up mb-4">
          <EmailForm
            placeholder={data.formPlaceholder}
            submitText={data.ctaButtonText}
            showNote={false}
            className="mx-auto"
          />
        </div>

        {/* Social Proof */}
        <p className="fade-in-up text-sm text-slate-500">
          <strong className="text-green">
            <Counter target={data.waitlistCount} />+ {data.socialProofText}
          </strong>
        </p>
      </div>
    </section>
  );
}
