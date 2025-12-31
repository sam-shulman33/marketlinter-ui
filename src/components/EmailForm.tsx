"use client";

import { useState, FormEvent, useTransition, useRef, useEffect } from "react";
import { subscribeToWaitlist } from "@/actions/subscribe";

interface EmailFormProps {
  placeholder?: string;
  submitText?: string;
  showNote?: boolean;
  noteText?: string;
  className?: string;
}

export function EmailForm({
  placeholder = "you@example.com",
  submitText = "Get Early Access",
  showNote = true,
  noteText = "No spam. Just launch updates and early pricing.",
  className = "",
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await subscribeToWaitlist(email);

        if (!result.success) {
          setError(result.message);
          return;
        }

        // Success!
        setIsSuccess(true);
        setEmail("");

        // Reset success state after 3 seconds
        successTimeoutRef.current = setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex max-w-[460px] flex-wrap justify-center gap-3 ${className}`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        disabled={isPending || isSuccess}
        aria-label="Email address"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? "email-error" : undefined}
        className="min-w-[240px] flex-1 rounded-lg border border-slate-700 bg-slate-800 px-[18px] py-[14px] text-[15px] text-white outline-none transition-all placeholder:text-slate-500 hover:border-slate-600 hover:bg-slate-700 focus:border-green focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending || isSuccess}
        className={`btn-shine whitespace-nowrap rounded-lg px-7 py-[14px] text-[15px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          isSuccess
            ? "bg-green-dark text-slate-950"
            : "bg-green text-slate-950 hover:-translate-y-0.5 hover:bg-green-dark hover:shadow-[0_4px_12px_var(--green-glow)] active:translate-y-0"
        }`}
      >
        {isSuccess ? "You're in!" : isPending ? "Joining..." : submitText}
      </button>

      {showNote && (
        <p className="mt-3 w-full text-center text-[13px] text-slate-500">
          {noteText}
        </p>
      )}

      {error && (
        <p
          id="email-error"
          role="alert"
          className="w-full text-center text-[13px] text-red"
        >
          {error}
        </p>
      )}
    </form>
  );
}
