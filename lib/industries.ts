export interface IndustryCard {
  name: string;
  pain: string;
  outcome: string;
}

export const industryCards: IndustryCard[] = [
  {
    name: "HVAC",
    pain: "Dispatch complexity, maintenance follow-up gaps, and inconsistent invoicing speed.",
    outcome: "Cleaner dispatch workflows, tighter follow-up automation, and faster post-job billing.",
  },
  {
    name: "Plumbing",
    pain: "Emergency scheduling pressure and manual handoffs between field and office staff.",
    outcome: "Live scheduling visibility and standardized handoffs that reduce office rework.",
  },
  {
    name: "Electrical",
    pain: "Project documentation inconsistencies and quote-to-job conversion delays.",
    outcome: "Repeatable documentation workflows and automated follow-up for open estimates.",
  },
  {
    name: "Home Health Agencies",
    pain: "Documentation overhead, compliance friction, and fragmented tools.",
    outcome: "Digital documentation systems with stronger process control and secure data handling.",
  },
  {
    name: "Property Management",
    pain: "Scattered maintenance requests and unpredictable vendor communication loops.",
    outcome: "Centralized request workflows and automation that improves response consistency.",
  },
  {
    name: "Construction",
    pain: "Coordination bottlenecks, paperwork lag, and delayed billing cycles.",
    outcome: "Structured workflows for job updates, approvals, and invoicing acceleration.",
  },
  {
    name: "Real Estate and Land Operations",
    pain: "Fragmented property data, slow asset evaluation, document-heavy workflows, and limited visibility across land, projects, and field operations.",
    outcome:
      "Centralized operational visibility, faster property and asset evaluation, structured document workflows, and stronger decision-making across real estate and land operations.",
  },
];
