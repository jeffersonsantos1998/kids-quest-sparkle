import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao enviar e-mail", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Verifique seu e-mail", description: "Enviamos um link para redefinir sua senha." });
    navigate("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <SEO title="Recuperar senha – Rotina Divertida" description="Redefina sua senha com segurança." />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Recuperar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="voce@exemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              <Link to="/login" className="story-link">Voltar ao login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPassword;
