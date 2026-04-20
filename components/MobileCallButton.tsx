import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

const sanitizePhone = (phone: string): string => phone.replace(/[^+\d]/g, "");

export function MobileCallButton() {
  return (
    <a
      href={`tel:${sanitizePhone(siteConfig.phone)}`}
      className="floating-call-button fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-900/40 print:hidden"
      aria-label="Call Steptech Innovation"
    >
      <Phone className="h-4 w-4" />
      Call Now
    </a>
  );
}
