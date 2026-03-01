"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { leadBaseSchema, type LeadFormValues } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

const industries = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Home Health Agency",
  "Property Management",
  "Construction",
  "Other Service Business",
];

interface ContactFormProps {
  inquiryType: "audit" | "contact";
  sourcePage: string;
  submitLabel: string;
  successMessage: string;
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none";

export function ContactForm({ inquiryType, sourcePage, submitLabel, successMessage }: ContactFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadBaseSchema),
    defaultValues: {
      currentTools: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSent(false);

    try {
      const payload = {
        ...values,
        currentTools: values.currentTools?.trim() ? values.currentTools.trim() : undefined,
        sourcePage,
        inquiryType,
      };

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: { success?: boolean; message?: string } = await response.json();

      if (!response.ok || !result.success) {
        setServerError(result.message ?? "We could not submit your request. Please call us directly.");
        return;
      }

      setSent(true);
      reset();
    } catch {
      setServerError("Network error. Please try again, or call us directly.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-5 p-6 md:p-8" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          Name
          <input type="text" {...register("name")} className={fieldClass} autoComplete="name" />
          {errors.name ? <span className="mt-1 block text-xs text-rose-300">{errors.name.message}</span> : null}
        </label>

        <label className="text-sm font-medium text-slate-200">
          Email
          <input type="email" {...register("email")} className={fieldClass} autoComplete="email" />
          {errors.email ? <span className="mt-1 block text-xs text-rose-300">{errors.email.message}</span> : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          Phone
          <input type="tel" {...register("phone")} className={fieldClass} autoComplete="tel" />
          {errors.phone ? <span className="mt-1 block text-xs text-rose-300">{errors.phone.message}</span> : null}
        </label>

        <label className="text-sm font-medium text-slate-200">
          Business Name
          <input type="text" {...register("businessName")} className={fieldClass} autoComplete="organization" />
          {errors.businessName ? <span className="mt-1 block text-xs text-rose-300">{errors.businessName.message}</span> : null}
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-200">
        Industry
        <select {...register("industry")} className={cn(fieldClass, "pr-10")}> 
          <option value="">Select your industry</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry ? <span className="mt-1 block text-xs text-rose-300">{errors.industry.message}</span> : null}
      </label>

      <label className="block text-sm font-medium text-slate-200">
        Biggest Bottleneck
        <textarea
          {...register("biggestBottleneck")}
          rows={4}
          className={fieldClass}
          placeholder="Ex: follow-up delays, dispatch confusion, invoicing lag, manual paperwork"
        />
        {errors.biggestBottleneck ? (
          <span className="mt-1 block text-xs text-rose-300">{errors.biggestBottleneck.message}</span>
        ) : null}
      </label>

      <label className="block text-sm font-medium text-slate-200">
        Current Tools (optional)
        <input
          type="text"
          {...register("currentTools")}
          className={fieldClass}
          placeholder="Ex: QuickBooks, Google Calendar, ServiceTitan, spreadsheets"
        />
        {errors.currentTools ? <span className="mt-1 block text-xs text-rose-300">{errors.currentTools.message}</span> : null}
      </label>

      {serverError ? <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-200">{serverError}</p> : null}
      {sent ? <p className="rounded-lg bg-emerald-500/15 p-3 text-sm text-emerald-200">{successMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
        {isSubmitting ? "Submitting..." : submitLabel}
        <Send className="ml-2 h-4 w-4" />
      </button>

      <p className="text-xs text-slate-400" aria-live="polite">
        We typically respond within one business day.
      </p>
    </form>
  );
}
