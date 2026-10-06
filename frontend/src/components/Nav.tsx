import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { brand } from "../config/brand";
import "./Nav.css";

const NAV_LINKS = [
  { to: "/", label: "Home",     end: true },
  { to: "/services", label: "Services", end: false },
  { to: "/about",    label: "About",    end: false },
  { to: "/work",     label: "Work",     end: false },
  { to: "/contact",  label: "Contact",  end: false },
];

export function Nav() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef  = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Prevent body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Focus first link when drawer opens
  useEffect(() => {
    if (open) {
      const first = drawerRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
    }
  }, [open]);

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " nav--scrolled" : ""}`} role="banner">
        <div className="container nav__inner">
          {/* Logo */}
          <Link to="/" className="nav__logo" aria-label={`${brand.name} — go to homepage`}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#4f46e5"/>
              <path d="M14 7L20 20H8L14 7Z" fill="white" fillOpacity="0.95"/>
            </svg>
            <span>{brand.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav__links" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `nav__link${isActive ? " nav__link--active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="btn btn-primary btn-sm nav__cta">
            Start a project
          </Link>

          {/* Mobile hamburger */}
          <button
            ref={triggerRef}
            className="nav__hamburger"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`hamburger-icon${open ? " is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="nav__backdrop"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`nav__drawer${open ? " nav__drawer--open" : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav aria-label="Mobile navigation links">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `nav__drawer-link${isActive ? " nav__drawer-link--active" : ""}`
              }
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="btn btn-primary nav__drawer-cta"
            onClick={close}
            tabIndex={open ? 0 : -1}
          >
            Start a project
          </Link>
        </nav>
      </div>
    </>
  );
}
