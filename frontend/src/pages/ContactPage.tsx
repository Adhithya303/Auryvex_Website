import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { brand, formatBudgetLabel } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { enquiriesApi } from "../api/enquiries";
import "./ContactPage.css";

interface FormValues {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  budget: string;
  timeline: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
  budget: "",
  timeline: "",
};

export default function ContactPage() {
  useDocumentMeta({
    title: `Start a Project — ${brand.name}`,
    description:
      "Tell us about the software you need built. We evaluate every brief and respond with clear next steps within 1–2 business days.",
  });

  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get("service") || "";

  const [values, setValues] = useState<FormValues>(() => ({
    ...initialValues,
    service: serviceParam,
  }));

  // Update service if query parameter changes
  useEffect(() => {
    if (serviceParam) {
      setValues((prev) => ({
        ...prev,
        service: serviceParam,
      }));
    }
  }, [serviceParam]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const validate = (data: FormValues): FormErrors => {
    const errs: FormErrors = {};

    if (!data.name.trim()) {
      errs.name = "Your name is required.";
    } else if (data.name.length > 100) {
      errs.name = "Name must be 100 characters or fewer.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errs.email = "Your email address is required.";
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    if (data.company.length > 100) {
      errs.company = "Company name must be 100 characters or fewer.";
    }

    if (!data.message.trim()) {
      errs.message = "Please describe your project or requirements.";
    } else if (data.message.trim().length < 20) {
      errs.message = `Message must be at least 20 characters (currently ${data.message.trim().length}).`;
    } else if (data.message.length > 2000) {
      errs.message = "Message must be 2000 characters or fewer.";
    }

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error immediately when edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    const currentValidation = validate(values);
    if (currentValidation[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: currentValidation[name as keyof FormErrors],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Focus first invalid field
      if (validationErrors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (validationErrors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (validationErrors.company && companyInputRef.current) {
        companyInputRef.current.focus();
      } else if (validationErrors.message && messageInputRef.current) {
        messageInputRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await enquiriesApi.submit({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim() || undefined,
        service: values.service || undefined,
        message: values.message.trim(),
        budget: values.budget || undefined,
        timeline: values.timeline || undefined,
      });

      setSubmitted(true);
    } catch {
      // Preserve all user-entered values on error
      setApiError(
        `We couldn't submit your enquiry. Please check your connection and try again, or contact us directly at ${brand.contactEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page animate-in">
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="contact-hero-section">
        <div className="container">
          <div className="contact-hero-content">
            <p className="section-eyebrow">Start a Project</p>
            <h1 className="contact-hero-title">
              Tell us about the software you need built
            </h1>
            <p className="contact-hero-lead">
              We review every brief and reply within 1–2 business days. You will speak directly with
              an engineer who understands architecture and business logic.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Form & Guidance Split ──────────────────────────────────────── */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-split-layout">
            {/* Left: What to expect & Trust info */}
            <aside className="contact-guidance-col" aria-label="What to expect when submitting a brief">
              <div className="guidance-card">
                <h2 className="guidance-title">Our Response Process</h2>
                <div className="guidance-timeline">
                  <div className="g-step">
                    <span className="g-num">1</span>
                    <div>
                      <strong>Engineering Review:</strong> We read your brief and assess technical
                      feasibility without sales pressure.
                    </div>
                  </div>
                  <div className="g-step">
                    <span className="g-num">2</span>
                    <div>
                      <strong>Clarifying Discussion:</strong> We reply within 1–2 business days with
                      honest preliminary feedback or a discovery call invite.
                    </div>
                  </div>
                  <div className="g-step">
                    <span className="g-num">3</span>
                    <div>
                      <strong>Transparent Scoping:</strong> If we agree it&apos;s a fit, we present a
                      fixed or sprint-based scope and realistic timeline.
                    </div>
                  </div>
                </div>
              </div>

              <div className="guidance-card guidance-card-direct">
                <h3 className="guidance-subhead">Direct Contact</h3>
                <p className="guidance-text">
                  Prefer discussing by email? Reach our founding team directly:
                </p>
                <a href={`mailto:${brand.contactEmail}`} className="direct-email-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{brand.contactEmail}</span>
                </a>
              </div>

              <div className="guidance-card">
                <h3 className="guidance-subhead">Need to Explore First?</h3>
                <p className="guidance-text">
                  Review our three confirmed service offerings to see which matches your immediate
                  challenge.
                </p>
                <Link to="/services" className="link-arrow">
                  Explore full services breakdown →
                </Link>
              </div>
            </aside>

            {/* Right: The Interactive Form */}
            <div className="contact-form-col">
              {submitted ? (
                <div className="contact-success-panel" role="status" aria-live="polite">
                  <div className="success-badge-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2>Enquiry Received</h2>
                  <p className="success-intro">
                    Thank you, <strong>{values.name}</strong>. Your project brief has been logged
                    directly into our internal system.
                  </p>

                  <div className="success-reassurance-box">
                    <h3>Next Steps</h3>
                    <ul>
                      <li>We review your requirements and data architecture considerations.</li>
                      <li>We respond to <strong>{values.email}</strong> within 1–2 business days.</li>
                      <li>We provide direct engineer feedback and clarify key priorities.</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setValues(initialValues);
                      setErrors({});
                    }}
                  >
                    Submit Another Brief
                  </button>
                </div>
              ) : (
                <form
                  className="contact-interactive-form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Project Brief Submission Form"
                >
                  <div className="form-legend-header">
                    <h2>Project Brief Details</h2>
                    <p>All fields marked with an asterisk (*) are required.</p>
                  </div>

                  {apiError && (
                    <div className="alert alert-error" role="alert">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label required">
                      Your Name
                    </label>
                    <input
                      ref={nameInputRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      placeholder="e.g. Alex Morgan"
                      className={`form-input ${errors.name ? "input-error" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <span id="name-error" className="field-error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label required">
                      Email Address
                    </label>
                    <input
                      ref={emailInputRef}
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="e.g. alex@company.com"
                      className={`form-input ${errors.email ? "input-error" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <span id="email-error" className="field-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Company */}
                  <div className="form-group">
                    <label htmlFor="contact-company" className="form-label">
                      Company / Organization <span className="label-hint">(optional)</span>
                    </label>
                    <input
                      ref={companyInputRef}
                      id="contact-company"
                      name="company"
                      type="text"
                      maxLength={100}
                      value={values.company}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? "company-error" : undefined}
                      placeholder="e.g. Apex Operations Ltd"
                      className={`form-input ${errors.company ? "input-error" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.company && (
                      <span id="company-error" className="field-error" role="alert">
                        {errors.company}
                      </span>
                    )}
                  </div>

                  {/* Service Interest */}
                  <div className="form-group">
                    <label htmlFor="contact-service" className="form-label">
                      Service Interest <span className="label-hint">(optional)</span>
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={values.service}
                      onChange={handleChange}
                      className="form-select"
                      disabled={isSubmitting}
                    >
                      <option value="">Select a service (or leave open)</option>
                      {brand.services.map((svc) => (
                        <option key={svc.id} value={svc.name}>
                          {svc.name}
                        </option>
                      ))}
                      <option value="Other">Other / General Technical Query</option>
                    </select>
                  </div>

                  {/* Optional Budget & Timeline Row */}
                  <div className="form-row-duo">
                    {brand.budgetOptions.length > 0 && (
                      <div className="form-group">
                        <label htmlFor="contact-budget" className="form-label">
                          Estimated Budget <span className="label-hint">(optional)</span>
                        </label>
                        <select
                          id="contact-budget"
                          name="budget"
                          value={values.budget}
                          onChange={handleChange}
                          className="form-select"
                          disabled={isSubmitting}
                        >
                          <option value="">Select budget range</option>
                          {brand.budgetOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {formatBudgetLabel(opt.label)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {brand.timelineOptions.length > 0 && (
                      <div className="form-group">
                        <label htmlFor="contact-timeline" className="form-label">
                          Target Timeline <span className="label-hint">(optional)</span>
                        </label>
                        <select
                          id="contact-timeline"
                          name="timeline"
                          value={values.timeline}
                          onChange={handleChange}
                          className="form-select"
                          disabled={isSubmitting}
                        >
                          <option value="">Select timeline</option>
                          {brand.timelineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label required">
                      Project Overview &amp; Requirements
                    </label>
                    <textarea
                      ref={messageInputRef}
                      id="contact-message"
                      name="message"
                      required
                      rows={6}
                      maxLength={2000}
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : "message-hint"}
                      placeholder="What process is currently manual or broken? What would the software need to do? Who will use it?"
                      className={`form-textarea ${errors.message ? "input-error" : ""}`}
                      disabled={isSubmitting}
                    />
                    <div className="textarea-footer">
                      {errors.message ? (
                        <span id="message-error" className="field-error" role="alert">
                          {errors.message}
                        </span>
                      ) : (
                        <span id="message-hint" className="field-hint">
                          Minimum 20 characters
                        </span>
                      )}
                      <span className="char-count">{values.message.length} / 2000</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions-bar">
                    <button
                      type="submit"
                      className="btn btn-primary btn-submit-project"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          <span>Submitting Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Project Brief</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </>
                      )}
                    </button>
                    <span className="privacy-reassurance">
                      We never share your email with third parties. Read our{" "}
                      <Link to="/privacy">Privacy Notice</Link>.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
