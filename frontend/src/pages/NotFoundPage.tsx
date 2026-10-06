import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  useDocumentMeta({
    title: `Page Not Found — ${brand.name}`,
    description: "The page you are looking for does not exist or has been moved.",
    robots: "noindex, follow",
  });

  return (
    <div className="notfound-page">
      <div className="container">
        <div className="notfound-card">
          <p className="notfound-code">404</p>
          <h1 className="notfound-title">Page not found</h1>
          <p className="notfound-text">
            The page you requested could not be located. It might have been moved, renamed, or is
            temporarily unavailable.
          </p>
          <div className="notfound-actions">
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
