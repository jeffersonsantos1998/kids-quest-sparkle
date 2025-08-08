import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/integrations/supabase/AuthProvider";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/app", { replace: true });
  }, [session, navigate]);
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO
        title="Rotina Divertida – Missões e Recompensas"
        description="Transforme tarefas em aventuras com estrelas, prêmios e um jardim mágico."
        canonical="/"
        image="https://lovable.dev/opengraph-image-p98pqg.png"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Rotina Divertida",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: 0, priceCurrency: "BRL" },
        }}
      />
      <section className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader>
            <h1 className="text-4xl font-bold text-primary text-center">Rotina Divertida!</h1>
            <p className="text-center text-muted-foreground mt-2">
              A ferramenta para transformar tarefas em uma aventura.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link to="/login" aria-label="Entrar na aplicação">
              <Button variant="hero" size="lg" className="w-full">Entrar</Button>
            </Link>
            <Link to="/registrar" aria-label="Registrar conta de responsável">
              <Button variant="success" size="lg" className="w-full">Registrar (para pais)</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              Ou veja uma prévia interativa: <Link to="/app" className="underline">Abrir demo</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Index;
