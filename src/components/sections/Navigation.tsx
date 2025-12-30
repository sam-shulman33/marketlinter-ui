"use client";

import { useEffect, useState } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-5">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
          >
            <circle cx="20" cy="20" r="18" stroke="#10B981" strokeWidth="2.5" />
            <path
              d="M12 20L17 25L28 14"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="20"
              cy="20"
              r="14"
              stroke="#10B981"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-slate-100">
            MarketLinter
          </span>
        </a>

        {/* CTA */}
        <a
          href="#pricing"
          className="nav-cta-effect rounded-md border border-green px-4 py-2 text-sm font-semibold text-green transition-all hover:text-slate-950"
        >
          View Pricing
        </a>
      </div>
    </nav>
  );
}
