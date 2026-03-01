"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/Container";

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-18 md:pb-24 md:pt-24">
      <Container>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card relative overflow-hidden px-6 py-14 md:px-12"
        >
          <div className="absolute inset-0 bg-hero-aurora opacity-80" aria-hidden="true" />
          <div className="absolute -right-18 top-8 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-14 bottom-8 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="eyebrow">ENGINEERED FOR HIGH-ACCOUNTABILITY ENVIRONMENTS</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Stop losing revenue to
              <span className="gradient-text"> broken processes and disconnected systems.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-cyan-50/95 md:text-xl">
              We engineer custom software and hardware-integrated systems that streamline operations, reduce labor
              costs, and eliminate stacked SaaS tools.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-cyan-100/80 md:text-base">
              Designed for small businesses and high-accountability environments, including logistics, commercial
              property management, HVAC and skilled trades, healthcare, law firms, government agencies, and defense
              environments.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/audit" className="btn-primary w-full sm:w-auto">
                Get Workflow Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href={siteConfig.calendlyUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto">
                Book a 15-minute Call
                <CalendarDays className="ml-2 h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100/80">
              <MapPin className="h-4 w-4" />
              Serving {siteConfig.serviceAreas.join(", ")}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
