export interface ServicePackage {
  name: string;
  priceRange: string;
  timeline: string;
  bestFor: string;
  deliverables: string[];
  ctaHref: string;
  ctaLabel: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

export interface SiteConfig {
  companyName: string;
  phone: string;
  email: string;
  serviceAreas: string[];
  calendlyUrl: string;
  auditPrice: number;
  packages: ServicePackage[];
}

const defaultAuditPrice = 250;
const envAuditPrice = Number.parseInt(process.env.NEXT_PUBLIC_AUDIT_PRICE ?? "", 10);

export const siteConfig: SiteConfig = {
  companyName: "Steptech Innovation LLC",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+1 (863) 555-0147",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@steptechinnovation.com",
  serviceAreas: ["Winter Haven", "Orlando", "Tampa"],
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/your-handle/workflow-audit",
  auditPrice: Number.isFinite(envAuditPrice) ? envAuditPrice : defaultAuditPrice,
  packages: [
    {
      name: "Workflow Automation Sprint",
      priceRange: "$3,500-$6,000",
      timeline: "2-3 weeks",
      bestFor: "Teams losing hours to manual data entry, follow-ups, and status checks.",
      deliverables: [
        "Process map of your current workflow and bottlenecks",
        "Automation setup for recurring admin tasks",
        "Unified dashboard for handoffs and status visibility",
        "Team handover training and documentation",
      ],
      ctaHref: "/audit",
      ctaLabel: "Start Your Sprint",
    },
    {
      name: "Dispatch & Scheduling System",
      priceRange: "$5,000-$12,000",
      timeline: "3-4 weeks",
      bestFor: "Service teams dealing with double-booking, delayed arrivals, and dispatch chaos.",
      deliverables: [
        "Real-time scheduling and dispatch board",
        "Automated reminders and technician routing logic",
        "Client-facing status updates and confirmations",
        "Performance reporting for jobs, response times, and utilization",
      ],
      ctaHref: "/audit",
      ctaLabel: "Fix Scheduling",
    },
    {
      name: "Digital Compliance & Documentation System",
      priceRange: "$4,000-$8,000",
      timeline: "2-4 weeks",
      bestFor: "Operators who need cleaner records, consistent forms, and fewer compliance misses.",
      deliverables: [
        "Custom digital forms and required-document workflows",
        "Automated alerts for missing documents or approvals",
        "Secure document storage with role-based access",
        "Audit-ready export process and SOP playbook",
      ],
      ctaHref: "/audit",
      ctaLabel: "Secure Documentation",
    },
  ],
};

export const faqItems: FAQItem[] = [
  {
    question: "How much will this cost my business?",
    answer:
      "Most projects start with a paid Workflow Audit so we can estimate labor savings and ROI before any build begins. Build packages are fixed-range, so you know scope and spend upfront.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Most systems go live in 2 to 4 weeks. We move quickly because we focus on one high-impact workflow first instead of trying to rebuild your whole operation at once.",
  },
  {
    question: "Do we have to replace our current tools?",
    answer:
      "Usually no. We connect with the tools you already use where possible, then add automation and custom workflows around them.",
  },
  {
    question: "What happens after delivery?",
    answer:
      "You get launch support, handover documentation, and optional ongoing optimization retainers if you want iterative improvements.",
  },
];

export const testimonialItems: TestimonialItem[] = [
  {
    name: "Operations Manager, Central Florida HVAC Company",
    role: "HVAC",
    quote:
      "We cut dispatch confusion in the first month and stopped losing jobs to follow-up gaps. Our office team finally has breathing room.",
  },
  {
    name: "Owner, Regional Plumbing Team",
    role: "Plumbing",
    quote:
      "Steptech mapped our process quickly and removed repetitive admin work. We now invoice faster and collect sooner.",
  },
  {
    name: "Director, Home Health Agency",
    role: "Home Health",
    quote:
      "Their documentation workflow helped us keep records organized without adding headcount. The rollout felt controlled and practical.",
  },
];
