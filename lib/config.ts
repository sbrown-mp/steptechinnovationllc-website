export interface ServicePackage {
  name: string;
  startingPrice: string;
  description: string;
  deliverables: string[];
  engagementRange: string;
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
  auditPrice: number;
  packages: ServicePackage[];
}

const defaultAuditPrice = 250;
const envAuditPrice = Number.parseInt(process.env.NEXT_PUBLIC_AUDIT_PRICE ?? "", 10);

export const siteConfig: SiteConfig = {
  companyName: "Steptech Innovation LLC",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+1 (863) 356-8603",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@steptechinnovation.com",
  serviceAreas: ["Winter Haven", "Orlando", "Tampa"],
  auditPrice: Number.isFinite(envAuditPrice) ? envAuditPrice : defaultAuditPrice,
  packages: [
    {
      name: "Custom Application Development",
      startingPrice: "$15,000",
      description:
        "We design and build custom operational platforms tailored to your workflows - including AI integration, secure dashboards, and hardware connectivity when required.",
      deliverables: [
        "Internal operations software",
        "Client portals & role-based dashboards",
        "AI-assisted workflow automation",
        "Secure cloud architecture",
        "API integrations",
      ],
      engagementRange: "Typical engagement range: $5,000 - $150,000+ depending on complexity.",
      ctaHref: "/audit",
      ctaLabel: "Discuss This Build",
    },
    {
      name: "SaaS Consolidation & System Replacement",
      startingPrice: "$15,000",
      description:
        "We eliminate tool sprawl by auditing your current software stack and engineering a unified system that reduces recurring SaaS costs and increases operational clarity.",
      deliverables: [
        "SaaS audit & cost analysis",
        "Tool redundancy elimination",
        "Data migration & system rebuild",
        "Unified reporting dashboards",
        "Subscription cost reduction strategy",
      ],
      engagementRange: "Typical engagement range: $5,000 - $120,000+ depending on scope.",
      ctaHref: "/audit",
      ctaLabel: "Discuss This Build",
    },
    {
      name: "Workflow Automation Systems",
      startingPrice: "$3,500",
      description:
        "We identify bottlenecks and implement automation logic that removes repetitive admin and accelerates revenue flow.",
      deliverables: [
        "Dispatch & scheduling automation",
        "Invoicing acceleration",
        "Task routing systems",
        "Real-time operational dashboards",
        "AI-triggered process alerts",
      ],
      engagementRange: "Typical engagement range: $3,500 - $12,000 depending on scope.",
      ctaHref: "/audit",
      ctaLabel: "Discuss This Build",
    },
    {
      name: "Hardware-Integrated Systems",
      startingPrice: "$25,000",
      description:
        "We design custom tracking devices and hardware-integrated platforms that connect physical operations to digital control systems.",
      deliverables: [
        "QR / barcode scanning systems",
        "RFID & NFC integration",
        "GPS-based tracking",
        "Asset & equipment monitoring",
        "Real-time device synchronization",
      ],
      engagementRange: "Typical engagement range: $15,000 - $150,000+ depending on hardware complexity.",
      ctaHref: "/audit",
      ctaLabel: "Discuss This Build",
    },
  ],
};

export const faqItems: FAQItem[] = [
  {
    question: "How much will this cost my business?",
    answer:
      "Most projects begin with a paid Workflow Audit so we can evaluate your systems, identify ROI opportunities, and define scope clearly. From there, engagements typically start at $15,000 depending on complexity, integrations, and whether hardware is involved. You'll always receive a clear scope and starting range before any build begins.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Smaller automation or consolidation projects can launch in 2-4 weeks. Larger custom system builds vary based on scope, integrations, and compliance requirements. We focus on delivering measurable milestones quickly rather than dragging projects across multi-month roadmaps.",
  },
  {
    question: "Do we have to replace our current tools?",
    answer:
      "Not necessarily. In some cases we integrate with the tools you already use. In others, replacing disconnected systems reduces cost and complexity long-term. We recommend the approach that improves control and reduces unnecessary subscriptions.",
  },
  {
    question: "What happens after delivery?",
    answer:
      "You receive launch support, documentation, and team training. We also offer optional ongoing improvement and system expansion retainers as your operation grows.",
  },
  {
    question: "Is this overkill for a small business?",
    answer:
      "Not at all. Many growing businesses outgrow generic software quickly. We design systems scaled to your operation today, with room to expand as you grow.",
  },
  {
    question: "Do you work with government or regulated environments?",
    answer:
      "Yes. We build secure, role-based systems designed for high-accountability environments, including regulated operations where control, visibility, and audit-ready processes matter.",
  },
];

export const testimonialItems: TestimonialItem[] = [
  {
    name: "Owner, Regional Service Contractor",
    role: "OPERATIONS",
    quote:
      "We replaced three disconnected tools with one unified system. The team stopped double-entering data and leadership finally trusts the numbers.",
  },
  {
    name: "Operations Manager, Local HVAC Contractor",
    role: "HVAC",
    quote:
      "Steptech built an internal dashboard that turned manual tracking into a single source of truth. We move faster because everyone sees the same real-time status.",
  },
  {
    name: "Director, Property Management Company",
    role: "PROPERTY MANAGEMENT",
    quote:
      "Asset tracking used to be guesswork. The scanner-based process gives us accountability and clean records without adding headcount.",
  },
];
