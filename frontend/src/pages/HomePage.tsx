import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./HomePage.css";

export default function HomePage() {
  useDocumentMeta({
    title: `${brand.name} — Custom Software for Growing Businesses`,
    description: brand.description,
  });

  return (
    <div className="home-page animate-in">
      {/* ── 1. TWO-COLUMN HERO ─────────────────────────────────────────────── */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="container hero-container">
          <div className="hero-grid">
            {/* Left: Text & Action */}
            <div className="hero-content">
              <div className="hero-badge-wrap">
                <span className="badge badge-concept">Software Studio</span>
                <span className="hero-badge-note">Direct engineer collaboration</span>
              </div>

              <h1 id="hero-heading" className="hero-title">
                We build software your business actually needs.
              </h1>

              <p className="hero-description">
                Auryvex engineers custom web applications, internal tools, and automation
                pipelines for businesses that have outgrown spreadsheets and generic SaaS.
              </p>

              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Start a project
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/work" className="btn btn-secondary btn-lg">
                  See our work
                </Link>
              </div>

              <div className="hero-guarantees">
                <div className="guarantee-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>100% Code Ownership</span>
                </div>
                <div className="guarantee-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>No Technical Jargon</span>
                </div>
                <div className="guarantee-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Pragmatic Timelines</span>
                </div>
              </div>
            </div>

            {/* Right: Rich Software Interface Visual */}
            <div className="hero-visual" aria-hidden="true">
              <div className="software-window">
                {/* Window top bar */}
                <div className="window-header">
                  <div className="window-dots">
                    <span className="dot dot-close" />
                    <span className="dot dot-minimize" />
                    <span className="dot dot-maximize" />
                  </div>
                  <div className="window-address-bar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>app.auryvex.internal / dispatch-engine</span>
                  </div>
                  <div className="window-badge">
                    <span className="pulse-indicator" />
                    <span>Live Service</span>
                  </div>
                </div>

                {/* Window app content */}
                <div className="window-body">
                  {/* Top stats strip */}
                  <div className="app-stats-row">
                    <div className="app-stat-box">
                      <span className="stat-label">Active Workflows</span>
                      <span className="stat-val">24</span>
                    </div>
                    <div className="app-stat-box">
                      <span className="stat-label">Sync Latency</span>
                      <span className="stat-val stat-success">42ms</span>
                    </div>
                    <div className="app-stat-box">
                      <span className="stat-label">Queue Health</span>
                      <span className="stat-val">99.98%</span>
                    </div>
                  </div>

                  {/* Operational Kanban/Queue board */}
                  <div className="app-workflow-board">
                    {/* Column 1: Incoming */}
                    <div className="workflow-col">
                      <div className="col-header">
                        <span className="col-name">Incoming Queue</span>
                        <span className="col-count">3</span>
                      </div>
                      <div className="workflow-card">
                        <div className="card-top">
                          <span className="ticket-tag tag-blue">Order #4892</span>
                          <span className="ticket-time">12m ago</span>
                        </div>
                        <p className="ticket-title">ERP Inventory Sync Request</p>
                        <div className="ticket-progress-bar">
                          <div className="ticket-progress-fill fill-30" />
                        </div>
                      </div>
                      <div className="workflow-card">
                        <div className="card-top">
                          <span className="ticket-tag tag-blue">Customer #104</span>
                          <span className="ticket-time">35m ago</span>
                        </div>
                        <p className="ticket-title">Automated Portal Provisioning</p>
                      </div>
                    </div>

                    {/* Column 2: In Processing */}
                    <div className="workflow-col">
                      <div className="col-header">
                        <span className="col-name">In Processing</span>
                        <span className="col-count col-count-active">2</span>
                      </div>
                      <div className="workflow-card card-active">
                        <div className="card-top">
                          <span className="ticket-tag tag-indigo">Batch Job #77</span>
                          <span className="ticket-status-pill">Active</span>
                        </div>
                        <p className="ticket-title">Multi-Supplier Reconciliation</p>
                        <div className="ticket-meta">
                          <span className="ticket-records">1,840 records</span>
                          <span className="ticket-pct">82%</span>
                        </div>
                        <div className="ticket-progress-bar">
                          <div className="ticket-progress-fill fill-80" />
                        </div>
                      </div>
                      <div className="workflow-card">
                        <div className="card-top">
                          <span className="ticket-tag tag-indigo">Webhook #12</span>
                          <span className="ticket-time">2m ago</span>
                        </div>
                        <p className="ticket-title">Stripe Settlement Webhook</p>
                      </div>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="workflow-col hide-mobile-col">
                      <div className="col-header">
                        <span className="col-name">Dispatched</span>
                        <span className="col-count">18</span>
                      </div>
                      <div className="workflow-card card-completed">
                        <div className="card-top">
                          <span className="ticket-tag tag-green">Report #310</span>
                          <span className="ticket-time">Completed</span>
                        </div>
                        <p className="ticket-title">Executive Weekly KPI Export</p>
                        <div className="ticket-check">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Archived to S3 bucket</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer caption */}
                <div className="window-footer">
                  <span className="illustrative-badge">Illustrative concept — Internal Operations Tool</span>
                  <span className="tech-stack-preview">React • FastAPI • SQLite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SERVICES OVERVIEW (VARIED COMPOSITION) ───────────────────────── */}
      <section className="section section--surface services-overview-section" aria-labelledby="services-overview-heading">
        <div className="container">
          <div className="section-head-row">
            <div>
              <p className="section-eyebrow">Our Focus</p>
              <h2 id="services-overview-heading" className="section-title">
                What we build for growing teams
              </h2>
            </div>
            <p className="section-head-description">
              We focus exclusively on software that directly improves operational throughput,
              replaces manual friction, and gives your business bespoke leverage.
            </p>
          </div>

          <div className="services-showcase-grid">
            {brand.services.map((svc, idx) => (
              <article key={svc.id} className="service-showcase-card">
                <div className="service-card-top">
                  <span className="service-num">0{idx + 1}</span>
                  <div className="service-icon-wrapper">
                    <ServiceIcon id={svc.id} />
                  </div>
                </div>

                <h3 className="service-card-title">{svc.name}</h3>
                <p className="service-card-summary">{svc.summary}</p>

                <div className="service-card-for">
                  <strong>Best for:</strong> {svc.forWho}
                </div>

                <div className="service-card-bottom">
                  <Link
                    to={`/contact?service=${encodeURIComponent(svc.name)}`}
                    className="service-card-action"
                  >
                    <span>Discuss this need</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="services-bottom-link">
            <Link to="/services" className="link-underlined">
              View comprehensive service breakdown and engagement details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. SELECTED WORK / CONCEPT PROJECTS ─────────────────────────────── */}
      <section className="section selected-work-section" aria-labelledby="work-heading">
        <div className="container">
          <div className="section-head-center">
            <p className="section-eyebrow">Concept Architectures</p>
            <h2 id="work-heading" className="section-title">
              Representative Systems
            </h2>
            <p className="section-subtitle">
              To protect client non-disclosure agreements, we showcase representative internal
              systems illustrating the architectural standards and interface polish we deliver.
            </p>
          </div>

          <div className="showcase-projects-grid">
            {/* Project 1 */}
            <article className="showcase-project-card">
              <div className="project-preview-mockup mockup-portal">
                <div className="mockup-header">
                  <span className="mockup-title">Client Operations Portal</span>
                  <span className="badge badge-concept">Concept project</span>
                </div>
                <div className="mockup-body">
                  <div className="portal-row">
                    <span className="portal-metric">Active Engagements: <strong>8</strong></span>
                    <span className="portal-metric">Pending Deliverables: <strong>3</strong></span>
                  </div>
                  <div className="portal-item">
                    <div className="item-icon-circle" />
                    <div className="item-texts">
                      <span className="item-line1">Q3 Milestone Verification</span>
                      <span className="item-line2">Awaiting stakeholder approval</span>
                    </div>
                    <span className="item-status status-amber">Review</span>
                  </div>
                  <div className="portal-item">
                    <div className="item-icon-circle done-circle" />
                    <div className="item-texts">
                      <span className="item-line1">Encrypted Asset Repository</span>
                      <span className="item-line2">12 files securely delivered</span>
                    </div>
                    <span className="item-status status-green">Approved</span>
                  </div>
                </div>
              </div>

              <div className="project-info-block">
                <div className="project-meta-row">
                  <span className="badge badge-neutral">Client Portal</span>
                  <span className="project-year">2024</span>
                </div>
                <h3>Secure Client Collaboration &amp; Approvals Hub</h3>
                <p>
                  A multi-tenant client portal built to eliminate fragmented email threads. Clients
                  view project timelines, inspect milestone proofs, and approve sign-offs in one
                  authenticated environment.
                </p>
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">FastAPI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Role-Based Auth</span>
                </div>
              </div>
            </article>

            {/* Project 2 */}
            <article className="showcase-project-card">
              <div className="project-preview-mockup mockup-inventory">
                <div className="mockup-header">
                  <span className="mockup-title">Inventory &amp; Dispatch Tracker</span>
                  <span className="badge badge-concept">Concept project</span>
                </div>
                <div className="mockup-body">
                  <div className="portal-row">
                    <span className="portal-metric">Tracked SKUs: <strong>1,420</strong></span>
                    <span className="portal-metric">Reorder Alerts: <strong>2</strong></span>
                  </div>
                  <div className="inventory-table-preview">
                    <div className="inv-row inv-head">
                      <span>SKU</span>
                      <span>Stock</span>
                      <span>Threshold</span>
                      <span>Action</span>
                    </div>
                    <div className="inv-row">
                      <span>#SKU-9921</span>
                      <span>140 units</span>
                      <span>50 units</span>
                      <span className="text-ok">Optimal</span>
                    </div>
                    <div className="inv-row row-alert">
                      <span>#SKU-4102</span>
                      <span className="text-low">12 units</span>
                      <span>25 units</span>
                      <span className="text-reorder">Reorder Sent</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-info-block">
                <div className="project-meta-row">
                  <span className="badge badge-neutral">Internal Tool</span>
                  <span className="project-year">2024</span>
                </div>
                <h3>Real-Time Inventory &amp; Automated Reordering</h3>
                <p>
                  A lightweight browser system replacing error-prone multi-sheet spreadsheets.
                  Maintains continuous stock records, flags depleted thresholds, and automatically
                  generates purchase orders.
                </p>
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">FastAPI</span>
                  <span className="tag">SQLite</span>
                  <span className="tag">Automated Triggers</span>
                </div>
              </div>
            </article>
          </div>

          <div className="work-all-link">
            <Link to="/work" className="btn btn-secondary">
              Explore All Concept Architectures →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. HOW WE WORK (PALE LAVENDER BACKGROUND) ───────────────────────── */}
      <section className="section section--lavender process-section" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-head-center">
            <p className="section-eyebrow">Our Methodology</p>
            <h2 id="process-heading" className="section-title">
              From first conversation to dependable delivery
            </h2>
            <p className="section-subtitle">
              We eliminate agency overhead and bureaucratic layers. You collaborate directly with
              senior engineers through four transparent stages.
            </p>
          </div>

          <div className="process-timeline-grid">
            <div className="process-step-card">
              <div className="step-number-badge">01</div>
              <h3 className="step-title">Discovery &amp; Scope</h3>
              <p className="step-text">
                We analyze your existing workflow, pinpoint data bottlenecks, and define the exact
                minimum viable software required to solve the problem—nothing more.
              </p>
            </div>

            <div className="process-step-card">
              <div className="step-number-badge">02</div>
              <h3 className="step-title">Architecture &amp; UX</h3>
              <p className="step-text">
                We outline data models, interface flows, and integration points. You review and
                approve interactive wireframes before extensive code is written.
              </p>
            </div>

            <div className="process-step-card">
              <div className="step-number-badge">03</div>
              <h3 className="step-title">Iterative Builds</h3>
              <p className="step-text">
                We work in transparent two-week sprints. You test staging builds continuously so
                there are zero surprises or misalignment at completion.
              </p>
            </div>

            <div className="process-step-card">
              <div className="step-number-badge">04</div>
              <h3 className="step-title">Handover &amp; Ownership</h3>
              <p className="step-text">
                We deploy to your infrastructure, supply complete documentation, and hand over 100%
                of code and credentials. No proprietary lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CONTRASTING FINAL CONTACT SECTION (DEEP NAVY) ────────────────── */}
      <section className="section section--navy final-cta-section" aria-labelledby="final-cta-heading">
        <div className="container">
          <div className="final-cta-box">
            <span className="badge badge-navy">Ready to Build?</span>
            <h2 id="final-cta-heading" className="final-cta-title">
              Let&apos;s build software that actually fits your workflow.
            </h2>
            <p className="final-cta-description">
              Share the challenge your business is facing. We evaluate every brief and respond with
              pragmatic options and transparent estimates within 1–2 business days.
            </p>
            <div className="final-cta-actions">
              <Link to="/contact" className="btn btn-white btn-lg">
                Start a project conversation
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/services" className="btn btn-navy-outline btn-lg">
                Review our services guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceIcon({ id }: { id: string }) {
  if (id === "web-applications") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  if (id === "internal-tools") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
