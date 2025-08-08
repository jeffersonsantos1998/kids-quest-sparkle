import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <SEO title="404 – Página não encontrada" description="A página que você tentou acessar não existe." />
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Ops! Página não encontrada</p>
        <a href="/" className="underline">Voltar para a Home</a>
      </section>
    </main>
  );
};

export default NotFound;
