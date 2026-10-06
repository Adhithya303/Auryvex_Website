import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function sitemapAndRobotsPlugin(): Plugin {
  return {
    name: "sitemap-robots-plugin",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      if (!fs.existsSync(distDir)) return;

      const rawSiteUrl = process.env.VITE_SITE_URL || "";
      const siteUrl = rawSiteUrl.replace(/\/+$/, "");

      const publicRoutes = [
        { path: "/", priority: "1.0", changefreq: "monthly" },
        { path: "/services", priority: "0.9", changefreq: "monthly" },
        { path: "/work", priority: "0.8", changefreq: "monthly" },
        { path: "/about", priority: "0.7", changefreq: "monthly" },
        { path: "/contact", priority: "0.8", changefreq: "monthly" },
        { path: "/privacy", priority: "0.5", changefreq: "monthly" },
      ];

      // Exclude admin pages strictly from web crawlers
      let robotsContent = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /api\nDisallow: /api/\n`;

      const distSitemap = path.join(distDir, "sitemap.xml");

      if (siteUrl && siteUrl.startsWith("http")) {
        robotsContent += `\nSitemap: ${siteUrl}/sitemap.xml\n`;

        const sitemapEntries = publicRoutes
          .map(
            (r) =>
              `  <url>\n    <loc>${siteUrl}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
          )
          .join("\n");

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
        fs.writeFileSync(distSitemap, sitemapContent, "utf-8");
      } else {
        robotsContent += `\n# Sitemap directive omitted until production site URL (VITE_SITE_URL) is configured\n`;
        if (fs.existsSync(distSitemap)) {
          fs.unlinkSync(distSitemap);
        }
      }

      fs.writeFileSync(path.join(distDir, "robots.txt"), robotsContent, "utf-8");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sitemapAndRobotsPlugin()],
  server: {
    proxy: {
      // Forward /api requests to the FastAPI backend during development
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      // Forward /api requests to the FastAPI backend during production preview
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React runtime in its own chunk
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
