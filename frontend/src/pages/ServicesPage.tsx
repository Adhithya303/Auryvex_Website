import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./ServicesPage.css";

interface ServiceDetailConfig {
  id: string;
  num: string;
  name: string;
  summary: string;
  description: string;
  forWho: string;
  deliverables: string[];
  ctaLabel: string;
  illustrationType: "web-app" | "automation" | "consulting";
}

const SERVICES_CONFIG: ServiceDetailConfig[] = [
  {
    id: "web-applications",
    num: "01",
    name: "Custom Web Applications",
    summary: "Tailored web software shaped precisely around your business workflows.",
    description:
      "We design and build bespoke web applications from the ground up. Whether you require a secure customer portal, an operational ordering platform, or a multi-tenant client system, we deliver fast, maintainable software engineered for longevity.",
    forWho: "Growing companies that have outgrown rigid off-the-shelf SaaS or complex spreadsheet webs.",
    deliverables: [
      "Role-based customer and client portals with strict access control",
      "Interactive data management systems and workflow engines",
      "Modern web frontends backed by dependable, secure APIs",
    ],
    ctaLabel: "Discuss Custom Web Apps",
    illustrationType: "web-app",
  },
  {
    id: "internal-tools",
    num: "02",
    name: "Internal Tools & Automation",
    summary: "Reliable browser software that replaces slow, manual administrative processes.",
    description:
      "We eliminate operational friction by building customized internal dashboards, reporting tools, and background pipelines. Our tools integrate cleanly with your existing data sources so your team can process work faster with zero human error.",
    forWho: "Operations and management teams spending valuable hours each week on repetitive data entry.",
    deliverables: [
      "Centralized operational dashboards and queue management boards",
      "Automated event pipelines connecting payments, billing, and fulfillment",
      "High-accuracy batch processing tools with exportable audit logs",
    ],
    ctaLabel: "Discuss Internal Tools",
    illustrationType: "automation",
  },
  {
    id: "technical-consulting",
    num: "03",
    name: "Technical Consulting",
    summary: "Objective, honest engineering advice to inform critical business decisions.",
    description:
      "We help business leaders make sound technology decisions without needing engineering expertise. From evaluating technical vendor bids to defining architectural roadmaps, we provide plain-English clarity and pragmatic recommendations.",
    forWho: "Founders and leadership teams facing significant software investments or technical dilemmas.",
    deliverables: [
      "Independent technical architecture reviews and codebase health audits",
      "Pragmatic software scoping and technical feasibility assessments",
      "Vendor proposal analysis and database technology evaluations",
    ],
    ctaLabel: "Book Technical Consulting",
    illustrationType: "consulting",
  },
];

export default function ServicesPage() {
  useDocumentMeta({
    title: `Services & Capabilities — ${brand.name}`,
    description:
      "Explore Auryvex's core capabilities: custom web applications, internal tools & automation, and technical consulting.",
  });

  return (
    <div className="services-page animate-in">
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="services-hero-section">
        <div className="container">
          <div className="services-hero-content">
            <p className="section-eyebrow">Our Services</p>
            <h1 className="services-hero-title">
              Software built around how you actually operate
            </h1>
            <p className="services-hero-lead">
              We build software to solve concrete operational bottlenecks. Every engagement is led
              by experienced engineers who understand business logic and software craft.
            </p>
          </div>
        </div>
      </section>

      {/* ── Detailed Services Sections ─────────────────────────────────────── */}
      <div className="services-sections-wrap">
        {SERVICES_CONFIG.map((svc, index) => (
          <section
            key={svc.id}
            id={svc.id}
            className={`service-block-section ${index % 2 === 1 ? "service-block-alt" : ""}`}
            aria-labelledby={`service-heading-${svc.id}`}
          >
            <div className="container">
              <div className={`service-split-grid ${index % 2 === 1 ? "service-grid-reverse" : ""}`}>
                {/* Left: Service Details */}
                <div className="service-info-column">
                  <div className="service-num-badge">{svc.num}</div>
                  <h2 id={`service-heading-${svc.id}`} className="service-title">
                    {svc.name}
                  </h2>
                  <p className="service-description">{svc.description}</p>

                  <div className="service-forwho-box">
                    <span className="forwho-label">Who this is for:</span>
                    <p className="forwho-text">{svc.forWho}</p>
                  </div>

                  <div className="deliverables-block">
                    <h3 className="deliverables-heading">Example Deliverables</h3>
                    <ul className="deliverables-list">
                      {svc.deliverables.map((item, dIdx) => (
                        <li key={dIdx}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-cta-wrap">
                    <Link
                      to={`/contact?service=${encodeURIComponent(svc.name)}`}
                      className="btn btn-primary"
                    >
                      {svc.ctaLabel} →
                    </Link>
                  </div>
                </div>

                {/* Right: Interface Illustration */}
                <div className="service-visual-column">
                  <ServiceIllustration type={svc.illustrationType} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Bottom Section: Final Reassurance ─────────────────────────────── */}
      <section className="section services-bottom-cta-section" aria-labelledby="cta-bottom-heading">
        <div className="container">
          <div className="services-bottom-card">
            <div className="bottom-card-texts">
              <span className="badge badge-concept">Not Sure Where to Start?</span>
              <h2 id="cta-bottom-heading">Let&apos;s discuss your workflow challenges</h2>
              <p>
                You don&apos;t need a finalized technical specification before contacting us. Tell us
                what isn&apos;t working in your current workflow and we&apos;ll explain how we would
                approach it.
              </p>
            </div>
            <div className="bottom-card-action">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Start a project conversation →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceIllustration({ type }: { type: "web-app" | "automation" | "consulting" }) {
  if (type === "web-app") {
    return (
      <div className="visual-card-frame" aria-hidden="true">
        <div className="card-top-bar">
          <div className="bar-dots">
            <span className="b-dot" />
            <span className="b-dot" />
            <span className="b-dot" />
          </div>
          <span className="bar-title">portal.clienthub.internal</span>
          <span className="bar-status-chip">Authenticated</span>
        </div>
        <div className="card-main-content">
          <div className="app-nav-row">
            <span className="app-tab tab-active">Client Directory</span>
            <span className="app-tab">Contracts</span>
            <span className="app-tab">Audit History</span>
          </div>
          <div className="app-table-mock">
            <div className="table-head-mock">
              <span>Account</span>
              <span>Permissions</span>
              <span>Status</span>
            </div>
            <div className="table-row-mock">
              <span className="row-title">Acme Industrial Ltd</span>
              <span className="row-role">Admin / Approver</span>
              <span className="badge-pill pill-active">Active</span>
            </div>
            <div className="table-row-mock">
              <span className="row-title">Sterling Global Logistics</span>
              <span className="row-role">Read &amp; Export</span>
              <span className="badge-pill pill-active">Active</span>
            </div>
            <div className="table-row-mock">
              <span className="row-title">Beacon Health Partners</span>
              <span className="row-role">Billing Admin</span>
              <span className="badge-pill pill-pending">Review</span>
            </div>
          </div>
          <div className="app-card-footer">
            <span className="footer-meta">FastAPI Auth • Strict Role Guards</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "automation") {
    return (
      <div className="visual-card-frame" aria-hidden="true">
        <div className="card-top-bar">
          <div className="bar-dots">
            <span className="b-dot" />
            <span className="b-dot" />
            <span className="b-dot" />
          </div>
          <span className="bar-title">pipeline.sync.internal / workers</span>
          <span className="bar-status-chip pill-success">Running</span>
        </div>
        <div className="card-main-content">
          <div className="pipeline-nodes">
            <div className="pipe-node">
              <div className="node-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="node-details">
                <span className="node-title">Webhook Listener</span>
                <span className="node-sub">Stripe &amp; ERP events</span>
              </div>
              <span className="node-badge">100% OK</span>
            </div>

            <div className="pipe-arrow-down">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>

            <div className="pipe-node node-active">
              <div className="node-icon icon-active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="node-details">
                <span className="node-title">Data Transformation &amp; Validate</span>
                <span className="node-sub">Idempotent SQLite queue</span>
              </div>
              <span className="node-badge badge-active">38ms avg</span>
            </div>

            <div className="pipe-arrow-down">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>

            <div className="pipe-node">
              <div className="node-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                </svg>
              </div>
              <div className="node-details">
                <span className="node-title">Target Dispatch &amp; Notification</span>
                <span className="node-sub">Automated email / SMS alerts</span>
              </div>
              <span className="node-badge">Zero Lag</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // consulting
  return (
    <div className="visual-card-frame" aria-hidden="true">
      <div className="card-top-bar">
        <div className="bar-dots">
          <span className="b-dot" />
          <span className="b-dot" />
          <span className="b-dot" />
        </div>
        <span className="bar-title">audit.evaluation.review</span>
        <span className="bar-status-chip">Report Ready</span>
      </div>
      <div className="card-main-content">
        <div className="consulting-metrics-card">
          <span className="metrics-head">System Architecture Assessment</span>
          <div className="metrics-grid">
            <div className="m-box">
              <span className="m-val score-green">Grade A</span>
              <span className="m-label">Database Schema</span>
            </div>
            <div className="m-box">
              <span className="m-val score-blue">&lt; 50ms</span>
              <span className="m-label">API Response Time</span>
            </div>
            <div className="m-box">
              <span className="m-val score-purple">100%</span>
              <span className="m-label">Code Ownership</span>
            </div>
          </div>
        </div>
        <div className="consulting-checklist">
          <div className="c-item">
            <span className="c-dot done" />
            <span>Eliminated multi-worker SQLite lock contention</span>
          </div>
          <div className="c-item">
            <span className="c-dot done" />
            <span>Configured automated WAL mode and daily backups</span>
          </div>
          <div className="c-item">
            <span className="c-dot done" />
            <span>Scoped straightforward path to PostgreSQL for future scale</span>
          </div>
        </div>
      </div>
    </div>
  );
}
