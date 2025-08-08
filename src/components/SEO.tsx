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

    const absoluteCanonical = (() => {
      const href = canonical || window.location.href;
      try {
        return href.startsWith("http") ? href : new URL(href, window.location.origin).href;
      } catch {
        return window.location.href;
      }
    })();

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

    const ogUrl = ensureMeta("og:url", "property");
    ogUrl.setAttribute("content", absoluteCanonical);

    const twitterCard = ensureMeta("twitter:card");
    twitterCard.setAttribute("content", "summary_large_image");

    const twitterTitle = ensureMeta("twitter:title");
    twitterTitle.setAttribute("content", title);

    if (image) {
      const ogImage = ensureMeta("og:image", "property");
      ogImage.setAttribute("content", image);
      const twImage = ensureMeta("twitter:image");
      twImage.setAttribute("content", image);
    }

    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = absoluteCanonical;

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
