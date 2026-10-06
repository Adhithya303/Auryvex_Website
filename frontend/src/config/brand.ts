/**
 * brand.ts — Single source of truth for all configurable brand values.
 *
 * LAUNCH BLOCKERS are marked with // LAUNCH BLOCKER comments.
 * Confirm each before going live.
 */

export interface ServiceOption {
  id: string;
  name: string;
  summary: string;
  description: string;
  forWho: string;
  howToEngage: string[];
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ConceptProject {
  id: string;
  name: string;
  summary: string;
  tech: string[];
  year: number;
}

export const brand = {
  name: 'Auryvex',
  tagline: 'We build software your business needs.',
  description:
    'Auryvex builds custom web applications and internal tools for businesses that need software that works exactly the way they do.',

  // LAUNCH BLOCKER: Confirm or update once domain is registered
  contactEmail: 'hello@auryvex.com',

  // LAUNCH BLOCKER: Set after domain is confirmed. Used in meta tags and sitemap.
  domain: '' as string, // e.g. 'https://auryvex.com'

  // Social handles — add once accounts exist, or leave empty to hide
  social: {
    // github: 'https://github.com/auryvex',
    // linkedin: 'https://linkedin.com/company/auryvex',
  } as Record<string, string>,

  /**
   * Services offered.
   * CONFIRM with the team before launch — only list what you will actually deliver.
   */
  services: [
    {
      id: 'web-applications',
      name: 'Custom Web Applications',
      summary: 'Tailored web software built for the way your business operates.',
      description:
        'We design and build web applications from the ground up, shaped around your specific workflows and requirements. Whether you need a customer portal, a booking system, or a data management tool, we deliver software that fits your business — not the other way around.',
      forWho:
        'Businesses that have outgrown spreadsheets and generic off-the-shelf software.',
      howToEngage: [
        'Book a free discovery call',
        'Share your requirements using our contact form',
      ],
    },
    {
      id: 'internal-tools',
      name: 'Internal Tools & Automation',
      summary: 'Custom software that replaces slow, manual processes.',
      description:
        'We build internal dashboards, reporting tools, and workflow automation that save your team hours each week. These tools are built specifically for your processes and connect with the systems you already use.',
      forWho:
        'Teams spending significant time on repetitive manual tasks that software could handle reliably.',
      howToEngage: [
        'Book a free discovery call',
        'Walk us through your current process using the contact form',
      ],
    },
    {
      id: 'technical-consulting',
      name: 'Technical Consulting',
      summary: 'Objective technical guidance for important decisions.',
      description:
        'We help founders and business owners make informed technical decisions without needing to be technical themselves. From reviewing a vendor proposal to planning a new product, we provide clear, honest advice in plain language.',
      forWho:
        'Non-technical founders or teams facing a significant technology choice.',
      howToEngage: [
        'Book a consulting session via the contact form',
        'Send an overview of the decision or challenge you are facing',
      ],
    },
  ] as ServiceOption[],

  /**
   * Budget options for the contact form.
   * LAUNCH BLOCKER: Confirm currency and ranges with the team.
   * Set currencySymbol to '', 'GBP', 'USD', 'EUR', etc.
   */
  currencySymbol: '', // e.g. '£' or '$' — leave empty to omit from labels
  budgetOptions: [
    { label: 'Under 5,000', value: 'under_5k' },
    { label: '5,000 – 20,000', value: '5k_20k' },
    { label: '20,000 – 50,000', value: '20k_50k' },
    { label: '50,000+', value: '50k_plus' },
    { label: 'Prefer not to say', value: 'undisclosed' },
  ] as SelectOption[],

  /**
   * Timeline options for the contact form.
   * Set to [] to hide the timeline field entirely.
   */
  timelineOptions: [
    { label: 'As soon as possible', value: 'asap' },
    { label: '1 – 3 months', value: '1_3_months' },
    { label: '3 – 6 months', value: '3_6_months' },
    { label: 'More than 6 months', value: '6_plus_months' },
    { label: 'Not sure yet', value: 'unsure' },
  ] as SelectOption[],

  /**
   * Concept projects for the Work page.
   * These are labelled clearly as concept/internal work — not client projects.
   * Remove or replace with real case studies when available.
   */
  conceptProjects: [
    {
      id: 'client-portal',
      name: 'Client Portal',
      summary:
        'A role-based portal for managing project communications, file sharing, and milestone approvals between a service business and its clients.',
      tech: ['React', 'FastAPI', 'PostgreSQL'],
      year: 2024,
    },
    {
      id: 'inventory-tool',
      name: 'Inventory Management Tool',
      summary:
        'A browser-based application for tracking stock levels, managing purchase orders, and generating supplier reports — replacing a multi-sheet spreadsheet workflow.',
      tech: ['React', 'FastAPI', 'SQLite'],
      year: 2024,
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      summary:
        'An executive-facing dashboard that consolidates key metrics from multiple data sources into a single, clear view for weekly reviews.',
      tech: ['React', 'Recharts', 'FastAPI'],
      year: 2024,
    },
  ] as ConceptProject[],
} as const;

/** Returns a formatted budget label including currency if configured. */
export function formatBudgetLabel(label: string): string {
  const sym = brand.currencySymbol;
  if (!sym) return label;
  // Insert currency symbol before each number-like segment
  return label.replace(/(\d[\d,]*)/g, `${sym}$1`);
}
