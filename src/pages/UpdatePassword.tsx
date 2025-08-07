import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const UpdatePassword = () => {
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user already has a session, they can update; otherwise, they must follow the recovery link again
    if (!session) {
      // Still allow form submission; Supabase sets a temporary session when coming from email link
    }
  }, [session]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Senha fraca", description: "Use pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas não conferem", description: "Digite a mesma senha nos dois campos.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao atualizar senha", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Senha atualizada", description: "Você já pode acessar o app." });
    navigate("/app", { replace: true });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <SEO title="Atualizar senha – Rotina Divertida" description="Defina uma nova senha para sua conta." />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Definir nova senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input id="confirm" type="password" placeholder="••••••••" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" variant="success" className="w-full" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default UpdatePassword;
