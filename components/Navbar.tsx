"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Link href="/" className="text-base font-bold tracking-tight text-white">
          Steptech
          <span className="ml-1 gradient-text">Innovation</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white",
                pathname === link.href && "bg-slate-800/80 text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/audit" className="btn-primary">
            Get Workflow Audit
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-lg border border-white/20 p-2 text-slate-200 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-white/10 bg-slate-950/95 lg:hidden">
          <div className="container-shell flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-slate-300",
                  pathname === link.href && "bg-slate-800 text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/audit" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Get Workflow Audit
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
