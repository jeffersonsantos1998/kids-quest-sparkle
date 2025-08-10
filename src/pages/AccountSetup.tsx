import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AccountSetup = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [planType, setPlanType] = useState<"free" | "premium">("free");

  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName) {
      toast({ title: "Erro", description: "Por favor, insira o nome da família.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Criar a conta familiar
      const { data, error } = await supabase.from("family_accounts").insert([
        { name: familyName, plan_type: planType }
      ]).select().single();

      if (error) throw error;

      const familyId = data.id;
      const userId = session?.user.id;

      // Vincular o usuário como responsável principal
      const { error: memberError } = await supabase.from("family_members").insert([
        { family_id: familyId, user_id: userId, role: "parent" }
      ]);

      if (memberError) throw memberError;

      toast({ title: "Sucesso", description: "Conta familiar criada com sucesso!" });
      navigate(planType === "premium" ? "/payment-setup" : "/app", { replace: true });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Erro ao criar conta familiar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <SEO title="Configurar Conta – Rotina Mágica" description="Configure sua conta familiar na Rotina Mágica." />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Configurar Conta Familiar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="familyName" className="text-sm font-medium">Nome da Família</label>
              <input
                id="familyName"
                type="text"
                placeholder="Família Silva"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Escolha seu Plano</p>
              <div className="flex gap-4 justify-center">
                <Button
                  type="button"
                  variant={planType === "free" ? "hero" : "outline"}
                  onClick={() => setPlanType("free")}
                >
                  Gratuito
                </Button>
                <Button
                  type="button"
                  variant={planType === "premium" ? "hero" : "outline"}
                  onClick={() => setPlanType("premium")}
                >
                  Premium
                </Button>
              </div>
            </div>
            <Button type="submit" variant="success" className="w-full" disabled={loading}>
              {loading ? "Configurando..." : "Finalizar Configuração"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AccountSetup;
