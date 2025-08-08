import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SEO } from "@/components/SEO";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Profile { id: string; email: string | null; display_name: string | null; created_at: string }
interface Role { user_id: string; role: "admin" | "moderator" | "user" }

const AdminDashboard = () => {
  const qc = useQueryClient();

  const { data: profiles = [], isLoading: loadingProfiles } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("id, email, display_name, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: roles = [], isLoading: loadingRoles } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("user_id, role");
      if (error) throw error;
      return data as Role[];
    },
  });

  const adminSet = useMemo(() => new Set(roles.filter(r => r.role === "admin").map(r => r.user_id)), [roles]);

  const setAdmin = async (userId: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      const { error } = await (supabase as any)
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) return toast({ title: "Erro ao promover", description: error.message, variant: "destructive" });
      toast({ title: "Promovido a admin" });
    } else {
      const { error } = await (supabase as any)
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) return toast({ title: "Erro ao rebaixar", description: error.message, variant: "destructive" });
      toast({ title: "Admin removido" });
    }
    await qc.invalidateQueries({ queryKey: ["roles"] });
  };

  return (
    <main className="min-h-screen p-6">
      <SEO title="Admin – Rotina Divertida" description="Painel de administração e gestão de usuários." />
      <header className="flex items-center justify-between max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary">Administração</h1>
        <div className="flex gap-2">
          <Link to="/app"><Button variant="outline">Voltar ao app</Button></Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {(loadingProfiles || loadingRoles) ? (
              <div className="h-24 animate-pulse rounded-md bg-muted" aria-label="Carregando lista" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Funções</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => {
                    const isAdmin = adminSet.has(p.id);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{p.display_name || p.email || p.id.slice(0, 8)}</span>
                            <span className="text-xs text-muted-foreground">{p.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "admin" : "user"}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant={isAdmin ? "secondary" : "success"} onClick={() => setAdmin(p.id, !isAdmin)}>
                            {isAdmin ? "Remover admin" : "Tornar admin"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboard;
