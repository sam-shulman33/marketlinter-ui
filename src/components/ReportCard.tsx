"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";

// Animated counter component for report values
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);

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

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();

    function animateCount() {
      const duration = 1500;
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
  }, [target]);

  return <span ref={elementRef}>{count}</span>;
}

// Report data (hardcoded to match the HTML reference)
const reportData = {
  idea: "Expense tracking app for freelancers",
  rows: [
    {
      icon: "success" as const,
      label: "Problem validated",
      value: "127 complaints / 30 days",
      counterValue: 127,
      hasCounter: true,
    },
    {
      icon: "success" as const,
      label: "High urgency",
      value: "sentiment: frustrated",
      hasCounter: false,
    },
    {
      icon: "warning" as const,
      label: "Competition present",
      value: "4 solutions found",
      counterValue: 4,
      hasCounter: true,
    },
    {
      icon: "success" as const,
      label: "Gap identified",
      value: '"too complex" mentioned 34x',
      counterValue: 34,
      hasCounter: true,
    },
  ],
  recommendation: "Strong signal. Differentiate on simplicity.",
};

export function ReportCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(4deg)"
  );
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer to trigger row animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tilt effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(4deg) rotateY(0deg) translateY(0)");
  };

  return (
    <div
      ref={cardRef}
      className="mx-auto max-w-[520px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-[400ms] hover:shadow-[0_8px_12px_rgba(0,0,0,0.15),0_30px_60px_rgba(0,0,0,0.35),0_0_0_1px_rgba(16,185,129,0.2)]"
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 3 6-6" />
        </svg>
        <span className="text-sm font-semibold text-slate-200">
          MarketLinter Report
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-green">
          <span className="animate-blink h-1.5 w-1.5 rounded-full bg-green" />
          complete
        </span>
      </div>

      {/* Idea */}
      <div className="animate-cursor-blink border-b border-slate-800 px-5 py-4 font-mono text-[13px] text-slate-400">
        idea: <span className="text-slate-200">&quot;{reportData.idea}&quot;</span>
      </div>

      {/* Report Rows */}
      <div>
        {reportData.rows.map((row, index) => (
          <div
            key={index}
            className={`report-row flex items-center border-b border-slate-800 px-5 py-3.5 text-sm transition-all last:border-b-0 hover:bg-white/[0.02] ${
              isVisible ? "animate-in" : ""
            }`}
          >
            {/* Icon */}
            <span
              className={`mr-3.5 flex h-[22px] w-[22px] items-center justify-center text-sm font-semibold transition-transform hover:scale-125 ${
                row.icon === "success"
                  ? "text-green"
                  : row.icon === "warning"
                    ? "text-amber"
                    : "text-red"
              }`}
            >
              {row.icon === "success" ? "✓" : row.icon === "warning" ? "⚠" : "✗"}
            </span>

            {/* Label */}
            <span className="text-slate-300">{row.label}</span>

            {/* Value */}
            <span className="ml-auto font-mono text-[13px] text-slate-400">
              {row.hasCounter && row.counterValue ? (
                <>
                  <Counter target={row.counterValue} />
                  {row.value.replace(String(row.counterValue), "")}
                </>
              ) : (
                row.value
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-800 px-5 py-4 text-[13px] text-slate-400">
        <strong className="text-green">Recommendation:</strong>{" "}
        {reportData.recommendation}
      </div>
    </div>
  );
}
