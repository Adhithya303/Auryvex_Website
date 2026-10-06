import { useEffect } from "react";
import { brand } from "../config/brand";

interface DocumentMeta {
  title?: string;
  description?: string;
  robots?: string;
}

/**
 * Set <title> and key <meta> tags per route.
 * Pass robots="noindex, nofollow" for admin routes.
 * Dynamically keeps Open Graph and Twitter tags in sync with page changes.
 */
export function useDocumentMeta({ title, description, robots }: DocumentMeta) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMetaProperty("og:title", title);
      setMetaName("twitter:title", title);
    }

    if (description) {
      setMetaName("description", description);
      setMetaProperty("og:description", description);
      setMetaName("twitter:description", description);
    }

    if (robots) {
      setMetaName("robots", robots);
    }

    // If a domain is configured, update canonical URL and og:url
    const siteDomain: string = brand.domain;
    if (siteDomain && typeof window !== "undefined") {
      const canonicalUrl = `${siteDomain.replace(/\/+$/, "")}${window.location.pathname}`;
      setCanonical(canonicalUrl);
      setMetaProperty("og:url", canonicalUrl);
    }

    return () => {
      // Restore standard robots tag when unmounting a protected route
      if (robots) {
        setMetaName("robots", "index, follow");
      }
    };
  }, [title, description, robots]);
}

function setMetaName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}
