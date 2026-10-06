import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import "./Footer.css";

const currentYear = new Date().getFullYear();

export function Footer() {
  const hasSocial = Object.keys(brand.social).length > 0;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label={`${brand.name} — go to homepage`}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#4f46e5" />
              <path d="M14 7L20 20H8L14 7Z" fill="white" fillOpacity="0.95" />
            </svg>
            <span>{brand.name}</span>
          </Link>
          <p className="footer__tagline">{brand.tagline}</p>
          {brand.contactEmail && (
            <a href={`mailto:${brand.contactEmail}`} className="footer__email">
              {brand.contactEmail}
            </a>
          )}
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <div className="footer__nav-group">
            <p className="footer__nav-heading">Company</p>
            <Link to="/services">Services</Link>
            <Link to="/work">Work</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Notice</Link>
          </div>

          <div className="footer__nav-group">
            <p className="footer__nav-heading">Internal</p>
            <Link to="/admin/login">Admin Portal</Link>
          </div>

          {hasSocial && (
            <div className="footer__nav-group">
              <p className="footer__nav-heading">Connect</p>
              {Object.entries(brand.social).map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
              ))}
            </div>
          )}
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {currentYear} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
