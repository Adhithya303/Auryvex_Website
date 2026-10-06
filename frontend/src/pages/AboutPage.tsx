import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./AboutPage.css";

export default function AboutPage() {
  useDocumentMeta({
    title: `About Us & Principles — ${brand.name}`,
    description:
      "Auryvex is a small founding software studio building custom applications and internal tools for businesses that value pragmatic engineering.",
  });

  return (
    <div className="about-page animate-in">
      {/* ── 1. Split Hero ───────────────────────────────────────────────────── */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-split-hero">
            <div className="about-hero-text">
              <p className="section-eyebrow">About Auryvex</p>
              <h1 className="about-hero-title">
                Software built with focus, craft, and honesty.
              </h1>
              <p className="about-hero-lead">
                We are a small founding engineering studio. We build custom software that solves
                real operational problems for growing businesses—delivering tools that are reliable,
                simple to use, and built to last.
              </p>
              <div className="about-hero-actions">
                <Link to="/contact" className="btn btn-primary">
                  Start a project conversation
                </Link>
                <Link to="/services" className="btn btn-secondary">
                  Explore our services
                </Link>
              </div>
            </div>

            <div className="about-hero-card-col">
              <div className="studio-card">
                <span className="studio-badge">Our Commitment</span>
                <h3 className="studio-card-title">What Working With Us Means</h3>
                <ul className="studio-commitments-list">
                  <li>
                    <span className="commitment-icon">✓</span>
                    <div>
                      <strong>Senior engineering only:</strong> You speak directly with the engineers
                      designing and writing your code.
                    </div>
                  </li>
                  <li>
                    <span className="commitment-icon">✓</span>
                    <div>
                      <strong>100% intellectual property ownership:</strong> Every line of code,
                      schema, and documentation belongs entirely to your business.
                    </div>
                  </li>
                  <li>
                    <span className="commitment-icon">✓</span>
                    <div>
                      <strong>Honest technical scoping:</strong> If an existing off-the-shelf product
                      solves your problem cheaper and faster, we will recommend it.
                    </div>
                  </li>
                  <li>
                    <span className="commitment-icon">✓</span>
                    <div>
                      <strong>Maintainable architecture:</strong> Clean, standard frameworks (React,
                      FastAPI, SQL) that any competent engineer can maintain.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Principles ───────────────────────────────────────────────────── */}
      <section className="section section--surface about-principles-section" aria-labelledby="principles-heading">
        <div className="container">
          <div className="section-head-center">
            <p className="section-eyebrow">Guiding Standards</p>
            <h2 id="principles-heading" className="section-title">
              Our Core Principles
            </h2>
            <p className="section-subtitle">
              We make architectural decisions based on long-term business value rather than industry
              fads.
            </p>
          </div>

          <div className="principles-grid">
            <div className="principle-card">
              <div className="principle-icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="principle-title">Pragmatism Over Novelty</h3>
              <p className="principle-text">
                Complex microservice architectures and fragile hype technologies add unnecessary
                costs. We rely on proven, stable stacks that do not require an entire DevOps team to
                keep running smoothly.
              </p>
            </div>

            <div className="principle-card">
              <div className="principle-icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3 className="principle-title">Direct Senior Collaboration</h3>
              <p className="principle-text">
                Agency hierarchies dilute communications. With Auryvex, you never speak to junior
                account managers. Every message and requirement is received and answered by an
                engineer who understands your system inside and out.
              </p>
            </div>

            <div className="principle-card">
              <div className="principle-icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="principle-title">Zero Vendor Lock-In</h3>
              <p className="principle-text">
                We believe your business should maintain total sovereignty over its software. We write
                clean, thoroughly tested, and well-documented code designed so you can take it in-house
                or hand it off whenever you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Discovery to Delivery Lifecycle ──────────────────────────────── */}
      <section className="section section--lavender about-lifecycle-section" aria-labelledby="lifecycle-heading">
        <div className="container">
          <div className="section-head-center">
            <p className="section-eyebrow">How Engagements Unfold</p>
            <h2 id="lifecycle-heading" className="section-title">
              Discovery to Production Delivery
            </h2>
            <p className="section-subtitle">
              A structured, transparent workflow ensuring predictability from the initial exploratory
              call to live server deployment.
            </p>
          </div>

          <div className="lifecycle-steps-grid">
            <div className="lifecycle-card">
              <div className="lifecycle-num">01</div>
              <h3 className="lifecycle-title">Workflow Audit &amp; Scope</h3>
              <p className="lifecycle-desc">
                We evaluate your existing operational processes, data inputs, and team pain points to
                define the leanest possible software solution.
              </p>
            </div>

            <div className="lifecycle-card">
              <div className="lifecycle-num">02</div>
              <h3 className="lifecycle-title">Architecture &amp; Wireframes</h3>
              <p className="lifecycle-desc">
                We map data schemas and construct interactive screen mockups so you experience the
                intended user journey before development begins.
              </p>
            </div>

            <div className="lifecycle-card">
              <div className="lifecycle-num">03</div>
              <h3 className="lifecycle-title">Iterative Sprint Builds</h3>
              <p className="lifecycle-desc">
                We build in rapid cycles with regular working demos on staging environments, allowing
                you to test and refine features continuously.
              </p>
            </div>

            <div className="lifecycle-card">
              <div className="lifecycle-num">04</div>
              <h3 className="lifecycle-title">Deployment &amp; IP Transfer</h3>
              <p className="lifecycle-desc">
                We deploy the tested system to your production infrastructure, verify backup systems,
                and transfer 100% of repositories and credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Team Stage & Honest Statement ────────────────────────────────── */}
      <section className="section about-stage-section" aria-labelledby="stage-heading">
        <div className="container">
          <div className="stage-statement-card">
            <span className="badge badge-concept">Our Stage</span>
            <h2 id="stage-heading" className="stage-statement-title">
              A focused founding team, built for depth over volume
            </h2>
            <p className="stage-statement-body">
              We operate deliberately as a compact studio. We do not juggle dozens of concurrent
              client accounts or delegate implementation to rotating contractors. When you work with
              Auryvex, you have our complete attention and direct engineering focus from day one.
            </p>
            <div className="stage-statement-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Discuss Your Requirements →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
