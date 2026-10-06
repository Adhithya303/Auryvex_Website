import { useEffect } from "react";

interface DocumentMeta {
  title?: string;
  description?: string;
  robots?: string;
}

/**
 * Set <title> and key <meta> tags per route.
 * Pass robots="noindex, nofollow" for admin routes.
 */
export function useDocumentMeta({ title, description, robots }: DocumentMeta) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (description) setMeta("description", description);
    if (robots) setMeta("robots", robots);

    return () => {
      // Restore defaults when unmounting (single-page navigation)
      if (robots) setMeta("robots", "index, follow");
    };
  }, [title, description, robots]);
}
