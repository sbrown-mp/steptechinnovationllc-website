import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/Container";

const sanitizePhone = (phone: string): string => phone.replace(/[^+\d]/g, "");

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/75 py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-white">{siteConfig.companyName}</p>
            <p className="mt-3 text-sm text-slate-300">
              Business technology solutions for operators who need less admin drag and cleaner workflow execution.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/90">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-white">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-white">
                  Workflow Audit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/90">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-cyan-200" />
                <a href={`tel:${sanitizePhone(siteConfig.phone)}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-cyan-200" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-cyan-200" />
                <span>{siteConfig.serviceAreas.join(" • ")}, Florida</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
