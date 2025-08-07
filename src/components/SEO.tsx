import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

export const SEO = ({ title, description, canonical, image, type = "website", jsonLd }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (name: string, attr: "name" | "property" = "name") => {
      let meta = document.head.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      return meta!;
    };

    if (description) {
      const metaDesc = ensureMeta("description");
      metaDesc.setAttribute("content", description);
      const ogDesc = ensureMeta("og:description", "property");
      ogDesc.setAttribute("content", description);
      const twitterDesc = ensureMeta("twitter:description");
      twitterDesc.setAttribute("content", description);
    }

    const ogTitle = ensureMeta("og:title", "property");
    ogTitle.setAttribute("content", title);

    const ogType = ensureMeta("og:type", "property");
    ogType.setAttribute("content", type);

    if (image) {
      const ogImage = ensureMeta("og:image", "property");
      ogImage.setAttribute("content", image);
      const twImage = ensureMeta("twitter:image");
      twImage.setAttribute("content", image);
    }

    if (canonical) {
      let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    if (jsonLd) {
      let script = document.getElementById("json-ld") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "json-ld";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonical, image, type, jsonLd]);

  return null;
};
