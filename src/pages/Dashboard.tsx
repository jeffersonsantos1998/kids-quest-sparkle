import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate]);

  return (
    <main className="min-h-screen p-6">
      <SEO title="Dashboard – Rotina Mágica" description="Gerencie sua família na Rotina Mágica." />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Painel da Rotina Mágica</h1>
        <p className="text-lg">Aqui você poderá gerenciar missões, recompensas e o progresso de sua família. Este é um placeholder para o dashboard completo que será implementado em breve.</p>
      </div>
    </main>
  );
};
