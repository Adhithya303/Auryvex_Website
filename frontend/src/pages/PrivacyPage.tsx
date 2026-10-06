import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./PrivacyPage.css";

export default function PrivacyPage() {
  useDocumentMeta({
    title: `Privacy Notice — ${brand.name}`,
    description:
      "A plain-language explanation of what data Auryvex collects through our contact form, how it is stored, and how it is used.",
  });

  return (
    <div className="privacy-page animate-in">
      <section className="privacy-hero-section">
        <div className="container">
          <div className="privacy-hero-content">
            <p className="section-eyebrow">Transparency &amp; Data</p>
            <h1 className="privacy-hero-title">Privacy Notice</h1>
            <p className="privacy-hero-lead">
              A plain-language summary of what information we collect through our project enquiry
              form, why we collect it, how it is stored, and how you can exercise your rights.
            </p>
          </div>
        </div>
      </section>

      <section className="privacy-body-section">
        <div className="container">
          <div className="privacy-content-card">
            {/* Launch requirement disclosure */}
            <div className="privacy-disclosure-box" role="note">
              <div className="disclosure-badge">Plain-Language Notice</div>
              <p>
                This document describes our current technical data handling practices in clear,
                straightforward language. It does not constitute formal legal counsel or statutory
                warranties. Items flagged with <strong>[LAUNCH REQUIREMENT]</strong> must be verified
                with company leadership upon formal incorporation before public deployment.
              </p>
            </div>

            <article className="privacy-article">
              <section className="privacy-section">
                <h2>1. Who We Are &amp; Contact Information</h2>
                <p>
                  <strong>{brand.name}</strong> operates as a software development studio providing
                  custom web applications, internal operational tools, and technical consulting.
                </p>
                <div className="privacy-highlight-box">
                  <p>
                    <strong>Contact Email:</strong>{" "}
                    {brand.contactEmail ? (
                      <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
                    ) : (
                      <span>[LAUNCH REQUIREMENT: Primary contact email to be confirmed]</span>
                    )}
                  </p>
                  <p>
                    <strong>Company Entity:</strong> [LAUNCH REQUIREMENT: Registered company entity
                    name, registration number, and registered address to be confirmed prior to public
                    launch.]
                  </p>
                </div>
              </section>

              <section className="privacy-section">
                <h2>2. What Information We Collect</h2>
                <p>
                  We collect information exclusively when you choose to submit a project brief or
                  contact enquiry via our website form. We do not gather personal information
                  passively or purchase third-party marketing lists.
                </p>

                <div className="privacy-table-wrap">
                  <table className="privacy-table">
                    <thead>
                      <tr>
                        <th scope="col">Field</th>
                        <th scope="col">Status</th>
                        <th scope="col">Why We Collect It</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Your Name</strong></td>
                        <td>Required (max 100 chars)</td>
                        <td>To address you personally in correspondence.</td>
                      </tr>
                      <tr>
                        <td><strong>Email Address</strong></td>
                        <td>Required (valid format)</td>
                        <td>
                          To reply to your brief with technical feedback, scoping notes, or a discovery
                          call invitation.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Company / Organisation</strong></td>
                        <td>Optional (max 100 chars)</td>
                        <td>To understand your business operational context.</td>
                      </tr>
                      <tr>
                        <td><strong>Service Interest</strong></td>
                        <td>Optional</td>
                        <td>
                          Identifies whether you need a Custom Web App, Internal Tool, Technical
                          Consulting, or General Query.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Project Brief &amp; Requirements</strong></td>
                        <td>Required (20–2000 chars)</td>
                        <td>
                          The substantive description of your workflow challenge so our engineers can
                          assess architectural feasibility.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Estimated Budget Bracket</strong></td>
                        <td>Optional</td>
                        <td>
                          Helps us recommend pragmatic architectures that match your financial
                          parameters.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Target Timeline</strong></td>
                        <td>Optional</td>
                        <td>Helps us evaluate team sprint availability.</td>
                      </tr>
                      <tr>
                        <td><strong>Client IP Address</strong></td>
                        <td>Transient / In-Memory</td>
                        <td>
                          Evaluated temporarily by our in-memory rate limiter (1 submission per 60
                          seconds) to prevent spam and denial-of-service abuse. It is not stored in our
                          database tables.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="privacy-section">
                <h2>3. How We Use Your Information</h2>
                <p>We process your submitted project brief for the following specific purposes:</p>
                <ul className="privacy-list">
                  <li>
                    <strong>Evaluating Technical Feasibility:</strong> Reviewing data flows, integrations,
                    and engineering requirements to determine if we can deliver an effective solution.
                  </li>
                  <li>
                    <strong>Direct Communication:</strong> Replying directly to your provided email
                    address with scoping feedback, cost estimates, or questions.
                  </li>
                  <li>
                    <strong>Internal Enquiry Tracking:</strong> Enabling our authorized team to track
                    the status of incoming briefs (New, In Progress, Closed) inside our protected admin
                    dashboard.
                  </li>
                </ul>
                <p>
                  <strong>We do not sell, rent, monetize, or share your personal data with third-party
                  advertisers or data brokers.</strong>
                </p>
              </section>

              <section className="privacy-section">
                <h2>4. Storage, Security &amp; Backups</h2>
                <p>
                  Enquiry records are stored in a dedicated SQLite database located on our production
                  server. We implement the following technical safeguards:
                </p>
                <ul className="privacy-list">
                  <li>
                    <strong>Filesystem Isolation:</strong> Database files reside outside the web server
                    root with restricted access permissions (read/write limited to the system process user).
                  </li>
                  <li>
                    <strong>Administrative Access Control:</strong> The enquiry inbox is protected by
                    secure HttpOnly, SameSite=Strict session cookies, unique cryptographic session IDs
                    (JTI) with server-side revocation, and CSRF token verification.
                  </li>
                  <li>
                    <strong>Transport Encryption:</strong> All communications between your browser and
                    our server are encrypted in transit via HTTPS / TLS.
                  </li>
                  <li>
                    <strong>Atomic Backups:</strong> Automated daily backups use the SQLite online backup
                    mechanism to ensure consistent snapshots with restricted filesystem permissions.
                  </li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>5. Data Retention</h2>
                <p>
                  We keep enquiry information only as long as necessary to address your project request
                  and maintain business records:
                </p>
                <ul className="privacy-list">
                  <li>
                    <strong>Active Discussions:</strong> Retained while project scoping, contract
                    negotiation, or active development is underway.
                  </li>
                  <li>
                    <strong>Closed / Inactive Enquiries:</strong> Archived or removed once discussions
                    conclude, or upon your explicit request.
                  </li>
                  <li>
                    <strong>[LAUNCH REQUIREMENT]:</strong> Formal statutory retention schedules
                    (e.g., tax/accounting vs general enquiries) must be confirmed and documented
                    prior to public operations.
                  </li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>6. Cookies &amp; Tracking Technologies</h2>
                <p>
                  Our public marketing pages do <strong>not</strong> use tracking cookies, behavioral
                  analytics cookies, or third-party advertising scripts.
                </p>
                <p>
                  The only cookies issued by our server are strictly necessary administrative cookies:
                </p>
                <ul className="privacy-list">
                  <li>
                    <code>access_token</code>: An HttpOnly authentication cookie used exclusively to
                    maintain logged-in sessions for authorized administrators.
                  </li>
                  <li>
                    <code>csrf_token</code>: A SameSite cookie used to prevent Cross-Site Request
                    Forgery when submitting changes in the admin dashboard.
                  </li>
                </ul>
                <p>
                  Public visitors submitting the contact form do not receive tracking cookies.
                </p>
              </section>

              <section className="privacy-section">
                <h2>7. Your Rights &amp; Requests</h2>
                <p>
                  You retain complete sovereignty over your information. At any time, you may:
                </p>
                <ul className="privacy-list">
                  <li>Request a summary of what information we hold about you.</li>
                  <li>Request correction of any inaccurate or outdated information.</li>
                  <li>
                    Request that we completely delete your enquiry and contact history from our
                    database.
                  </li>
                </ul>
                <p>
                  To make any of these requests, simply contact our engineering team directly:
                </p>
                <div className="privacy-contact-action">
                  {brand.contactEmail && (
                    <a href={`mailto:${brand.contactEmail}`} className="btn btn-secondary">
                      Email {brand.contactEmail}
                    </a>
                  )}
                  <Link to="/contact" className="btn btn-primary">
                    Submit a query via contact form →
                  </Link>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
