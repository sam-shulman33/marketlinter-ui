"use client";

import { useRef, useState, useEffect, MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  stagger,
} from "motion/react";

// Animated counter component for report values
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-50px" });

  // Trigger animation when in view (using useEffect to avoid ref access during render)
  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;

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
  }, [isInView, target]);

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

// Animation variants for staggered rows
const rowContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren" as const,
      delayChildren: stagger(0.12),
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

// Spring configuration for tilt effect
const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };

export function ReportCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-animated rotation values
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateY = useSpring(0, springConfig);

  // Handle mouse movement for tilt effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
    translateY.set(-8);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    translateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="mx-auto max-w-[520px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]"
      style={
        shouldReduceMotion
          ? {}
          : {
              rotateX,
              rotateY,
              translateY,
              transformPerspective: 1000,
            }
      }
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 4 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
        delay: 0.2,
      }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              boxShadow:
                "0 8px 12px rgba(0,0,0,0.15), 0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(16,185,129,0.2)",
            }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring" as const,
            stiffness: 200,
            damping: 15,
            delay: 0.5,
          }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 3 6-6" />
        </motion.svg>
        <span className="text-sm font-semibold text-slate-200">
          MarketLinter Report
        </span>
        <motion.span
          className="ml-auto flex items-center gap-1.5 font-mono text-xs text-green"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-green"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: [1, 0.3, 1],
                  }
            }
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
          complete
        </motion.span>
      </motion.div>

      {/* Idea */}
      <motion.div
        className="border-b border-slate-800 px-5 py-4 font-mono text-[13px] text-slate-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <span>idea: </span>
        <motion.span
          className="text-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          &quot;{reportData.idea}&quot;
        </motion.span>
        <motion.span
          className="text-green"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [1, 0],
                }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
          }}
        >
          |
        </motion.span>
      </motion.div>

      {/* Report Rows */}
      <motion.div
        variants={rowContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {reportData.rows.map((row, index) => (
          <motion.div
            key={index}
            variants={rowVariants}
            className="flex items-center border-b border-slate-800 px-5 py-3.5 text-sm last:border-b-0"
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                  }
            }
          >
            {/* Icon */}
            <motion.span
              className={`mr-3.5 flex h-[22px] w-[22px] items-center justify-center text-sm font-semibold ${
                row.icon === "success"
                  ? "text-green"
                  : row.icon === "warning"
                    ? "text-amber"
                    : "text-red"
              }`}
              whileHover={shouldReduceMotion ? {} : { scale: 1.25 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
            >
              {row.icon === "success" ? "✓" : row.icon === "warning" ? "⚠" : "✗"}
            </motion.span>

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
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        className="border-t border-slate-700 bg-slate-800 px-5 py-4 text-[13px] text-slate-400"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <strong className="text-green">Recommendation:</strong>{" "}
        {reportData.recommendation}
      </motion.div>
    </motion.div>
  );
}
