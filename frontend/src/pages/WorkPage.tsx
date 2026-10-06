import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./WorkPage.css";

export default function WorkPage() {
  useDocumentMeta({
    title: `Selected Work & Concept Projects — ${brand.name}`,
    description:
      "Inspect representative software architectures and internal tool designs crafted by Auryvex.",
  });

  return (
    <div className="work-page animate-in">
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="work-hero-section">
        <div className="container">
          <div className="work-hero-content">
            <p className="section-eyebrow">Portfolio &amp; Architecture</p>
            <h1 className="work-hero-title">
              Representative Systems &amp; Concept Architectures
            </h1>
            <p className="work-hero-lead">
              Below are three representative concept architectures demonstrating our engineering
              approach, interface clarity, and database design. Each concept illustrates how we
              solve operational friction with bespoke software.
            </p>
          </div>
        </div>
      </section>

      {/* ── Detailed Project Showcases ──────────────────────────────────────── */}
      <section className="work-showcases-section">
        <div className="container">
          <div className="projects-detailed-list">
            {/* Project 1: Client Portal */}
            <article className="detailed-project-item">
              <div className="project-visual-frame">
                <div className="frame-header">
                  <div className="frame-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="frame-url">client-hub.example / portal</span>
                  <span className="badge badge-concept">Concept project</span>
                </div>
                <div className="frame-content portal-preview-grid">
                  <div className="portal-sidebar-mock">
                    <span className="sidebar-brand">ClientHub</span>
                    <span className="side-nav-item active">Overview</span>
                    <span className="side-nav-item">Deliverables (4)</span>
                    <span className="side-nav-item">Invoicing</span>
                    <span className="side-nav-item">Settings</span>
                  </div>
                  <div className="portal-main-mock">
                    <div className="main-stat-banner">
                      <div className="stat-pill">
                        <span className="lbl">Sprint Status</span>
                        <span className="val">On Track</span>
                      </div>
                      <div className="stat-pill">
                        <span className="lbl">Sign-offs Pending</span>
                        <span className="val text-amber">1 Review</span>
                      </div>
                    </div>
                    <div className="portal-task-card">
                      <div className="task-row">
                        <span className="task-name">Phase 2 API Integration Build</span>
                        <span className="task-badge badge-green">Ready for Sign-off</span>
                      </div>
                      <p className="task-desc">
                        Staging deployment verified on Python 3.11 with SQLite WAL mode.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-text-content">
                <div className="project-tags-top">
                  <span className="badge badge-neutral">Client Experience</span>
                  <span className="project-year">2024</span>
                </div>
                <h2 className="project-heading">Client Operations &amp; Milestone Portal</h2>
                
                <div className="project-problem-solution">
                  <div className="case-col">
                    <h3 className="case-subhead">The Operational Problem</h3>
                    <p>
                      Service businesses routinely lose track of project approvals, contracts, and
                      shared files inside endless email chains and unencrypted cloud folders,
                      leading to delayed sign-offs and client frustration.
                    </p>
                  </div>
                  <div className="case-col">
                    <h3 className="case-subhead">Concept Architecture &amp; Approach</h3>
                    <p>
                      A streamlined multi-tenant portal with role-based JWT cookie authentication.
                      Clients review interactive deliverables, upload assets directly into scoped
                      buckets, and sign off on project milestones in one centralized dashboard.
                    </p>
                  </div>
                </div>

                <div className="project-stack-row">
                  <span className="stack-label">Architecture:</span>
                  <div className="stack-tags">
                    <span className="tag">React</span>
                    <span className="tag">FastAPI</span>
                    <span className="tag">PostgreSQL</span>
                    <span className="tag">Role-Based Access</span>
                  </div>
                </div>

                <div className="project-action-row">
                  <Link
                    to="/contact?service=Custom+Web+Applications"
                    className="btn btn-secondary btn-sm"
                  >
                    Discuss a custom portal like this →
                  </Link>
                </div>
              </div>
            </article>

            {/* Project 2: Inventory Management Tool */}
            <article className="detailed-project-item">
              <div className="project-visual-frame">
                <div className="frame-header">
                  <div className="frame-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="frame-url">inventory.internal / dispatch</span>
                  <span className="badge badge-concept">Concept project</span>
                </div>
                <div className="frame-content inventory-preview-grid">
                  <div className="inventory-header-strip">
                    <div className="inv-badge-stat">
                      <span className="lbl">Monitored Items</span>
                      <span className="val">2,140 SKUs</span>
                    </div>
                    <div className="inv-badge-stat">
                      <span className="lbl">Automated Reorders (7d)</span>
                      <span className="val">18 Triggered</span>
                    </div>
                  </div>
                  <div className="inventory-sheet-mock">
                    <div className="sheet-row sheet-head">
                      <span>SKU Code</span>
                      <span>Stock Level</span>
                      <span>Safety Floor</span>
                      <span>System Status</span>
                    </div>
                    <div className="sheet-row">
                      <span className="sku-mono">SKU-A992</span>
                      <span>320 units</span>
                      <span>100 units</span>
                      <span className="status-pill status-healthy">Healthy</span>
                    </div>
                    <div className="sheet-row row-warning">
                      <span className="sku-mono">SKU-C104</span>
                      <span>18 units</span>
                      <span>50 units</span>
                      <span className="status-pill status-low">PO Generated</span>
                    </div>
                    <div className="sheet-row">
                      <span className="sku-mono">SKU-E774</span>
                      <span>840 units</span>
                      <span>200 units</span>
                      <span className="status-pill status-healthy">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-text-content">
                <div className="project-tags-top">
                  <span className="badge badge-neutral">Operations Tool</span>
                  <span className="project-year">2024</span>
                </div>
                <h2 className="project-heading">Inventory &amp; Automated Supplier Dispatch</h2>

                <div className="project-problem-solution">
                  <div className="case-col">
                    <h3 className="case-subhead">The Operational Problem</h3>
                    <p>
                      Managing supply orders via multi-tab spreadsheets leads to accidental stockouts,
                      delayed replenishment, and zero concurrency when multiple warehouse staff update
                      numbers simultaneously.
                    </p>
                  </div>
                  <div className="case-col">
                    <h3 className="case-subhead">Concept Architecture &amp; Approach</h3>
                    <p>
                      A browser-based inventory command hub backed by SQLite with WAL concurrency.
                      Whenever warehouse stock dips below configured safety floors, webhook triggers
                      automatically compile purchase orders and queue them for supplier confirmation.
                    </p>
                  </div>
                </div>

                <div className="project-stack-row">
                  <span className="stack-label">Architecture:</span>
                  <div className="stack-tags">
                    <span className="tag">React</span>
                    <span className="tag">FastAPI</span>
                    <span className="tag">SQLite (WAL Mode)</span>
                    <span className="tag">Automated Triggers</span>
                  </div>
                </div>

                <div className="project-action-row">
                  <Link
                    to="/contact?service=Internal+Tools+%26+Automation"
                    className="btn btn-secondary btn-sm"
                  >
                    Discuss an inventory tool like this →
                  </Link>
                </div>
              </div>
            </article>

            {/* Project 3: Analytics Dashboard */}
            <article className="detailed-project-item">
              <div className="project-visual-frame">
                <div className="frame-header">
                  <div className="frame-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="frame-url">analytics.hub.internal / executive</span>
                  <span className="badge badge-concept">Concept project</span>
                </div>
                <div className="frame-content analytics-preview-grid">
                  <div className="analytics-kpi-row">
                    <div className="kpi-card">
                      <span className="kpi-title">Weekly Operational Throughput</span>
                      <span className="kpi-number">94.8%</span>
                      <span className="kpi-sub green">+3.2% vs baseline</span>
                    </div>
                    <div className="kpi-card">
                      <span className="kpi-title">Average Processing Lag</span>
                      <span className="kpi-number">48ms</span>
                      <span className="kpi-sub green">Optimal SLA</span>
                    </div>
                  </div>
                  <div className="chart-mockup-box">
                    <div className="mock-bar-chart">
                      <div className="chart-bar bar-1"><span className="bar-val">M</span></div>
                      <div className="chart-bar bar-2"><span className="bar-val">T</span></div>
                      <div className="chart-bar bar-3"><span className="bar-val">W</span></div>
                      <div className="chart-bar bar-4"><span className="bar-val">T</span></div>
                      <div className="chart-bar bar-5 active-bar"><span className="bar-val">F</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-text-content">
                <div className="project-tags-top">
                  <span className="badge badge-neutral">Analytics &amp; Data</span>
                  <span className="project-year">2024</span>
                </div>
                <h2 className="project-heading">Operational KPI &amp; Executive Reporting Engine</h2>

                <div className="project-problem-solution">
                  <div className="case-col">
                    <h3 className="case-subhead">The Operational Problem</h3>
                    <p>
                      Business leaders often depend on weekly manual copy-pasting between disparate SaaS
                      dashboards and billing accounts, causing delays in detecting cost spikes or
                      operational slowdowns.
                    </p>
                  </div>
                  <div className="case-col">
                    <h3 className="case-subhead">Concept Architecture &amp; Approach</h3>
                    <p>
                      An executive reporting engine that consolidates metrics from internal database
                      records and third-party webhooks into an uncluttered interface with automated
                      weekly summary exports.
                    </p>
                  </div>
                </div>

                <div className="project-stack-row">
                  <span className="stack-label">Architecture:</span>
                  <div className="stack-tags">
                    <span className="tag">React</span>
                    <span className="tag">Recharts</span>
                    <span className="tag">FastAPI</span>
                    <span className="tag">Data Aggregation</span>
                  </div>
                </div>

                <div className="project-action-row">
                  <Link
                    to="/contact?service=Internal+Tools+%26+Automation"
                    className="btn btn-secondary btn-sm"
                  >
                    Discuss an analytics tool like this →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="section work-bottom-cta-section">
        <div className="container">
          <div className="work-cta-card">
            <h2>Have a specific operational workflow you want built?</h2>
            <p>
              Tell us about the tool or application your business is missing. We evaluate your
              requirements and outline realistic technical solutions with honest timelines.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Start a project conversation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
