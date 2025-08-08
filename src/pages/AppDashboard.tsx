import { lazy, Suspense, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/integrations/supabase/AuthProvider";

const PerformanceChart = lazy(() => import("@/components/PerformanceChart"));

interface Mission { id: number; title: string; stars: number; }

const initialMissions: Mission[] = [
  { id: 1, title: "Acordar Sozinho", stars: 10 },
  { id: 2, title: "Higiene / Se arrumar para escola", stars: 10 },
  { id: 3, title: "Arrumar o quarto", stars: 15 },
  { id: 4, title: "Ler 1 página do livro", stars: 20 },
  { id: 5, title: "Limpar a mesa pós jantar", stars: 10 },
];

const rewards = [
  { id: 1, title: "Brincar no quarto", cost: 130 },
  { id: 2, title: "Jogar 30 min de vídeo game", cost: 220 },
  { id: 3, title: "Assistir 1 Hr de TV", cost: 315 },
  { id: 4, title: "Passeio no parque", cost: 450 },
];

const AppDashboard = () => {
  const { signOut, user } = useAuth();
  const [completed, setCompleted] = useState<number[]>([]);
  const [stars, setStars] = useState<number>(835);

  const totalStarsToday = useMemo(() => {
    return initialMissions
      .filter((m) => completed.includes(m.id))
      .reduce((acc, m) => acc + m.stars, 0);
  }, [completed]);

  const allDone = completed.length === initialMissions.length;

  const toggleMission = (id: number) => {
    setCompleted((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      // Award or remove stars optimistically
      const target = initialMissions.find((m) => m.id === id)!;
      setStars((s) => s + (exists ? -target.stars : target.stars));

      // Daily bonus
      const willBeAllDone = next.length === initialMissions.length;
      const wasAllDone = prev.length === initialMissions.length;
      if (willBeAllDone && !wasAllDone) {
        toast({ title: "Bônus diário desbloqueado!", description: "+1,00 cofrinho e +1 gota d'água." });
      }
      if (!willBeAllDone && wasAllDone) {
        toast({ title: "Bônus revertido", description: "Tarefa desmarcada após 100% concluído." });
      }
      return next;
    });
  };

  const redeem = (cost: number, title: string) => {
    if (stars < cost) return;
    setStars((s) => s - cost);
    toast({ title: "Resgatado!", description: `${title} (-${cost} ⭐)` });
  };

  const last7 = ["Sex", "Sáb", "Dom", "Seg", "Ter", "Qua", "Qui"].map((d, i) => ({
    name: d,
    tarefas: [9, 12, 12, 9, 9, 9, 5][i],
  }));

  return (
    <main className="min-h-screen p-6">
      <SEO title="App – Rotina Divertida" description="Complete suas missões e troque estrelas por prêmios." />
      <header className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-primary">Rotina Divertida!</h1>
          <p className="text-muted-foreground">Olá! Complete suas missões ✨</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-success text-success-foreground hover:bg-success/90">Cofrinho: R$ 2,00</Badge>
          <Button variant="outline" onClick={async () => { const { error } = await signOut(); if (error) console.error(error); }}>Sair</Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-6">
        <Tabs defaultValue="missoes">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="missoes">Missões</TabsTrigger>
            <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
            <TabsTrigger value="loja">Loja</TabsTrigger>
            <TabsTrigger value="prof">Jardim / Professor</TabsTrigger>
          </TabsList>

          <TabsContent value="missoes" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-center">Meu Cofre de Estrelas ⭐</CardTitle>
                <p className="text-center text-4xl text-success font-semibold">{stars}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {initialMissions.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id={`m-${m.id}`} checked={completed.includes(m.id)} onCheckedChange={() => toggleMission(m.id)} />
                      <label htmlFor={`m-${m.id}`} className="cursor-pointer select-none">
                        {completed.includes(m.id) ? <span className="line-through text-muted-foreground">{m.title}</span> : m.title}
                      </label>
                    </div>
                    <span className="text-muted-foreground">+{m.stars} ⭐</span>
                  </div>
                ))}
                {allDone && (
                  <div className="rounded-md bg-success/10 text-success px-4 py-3">Dia completo! Bônus aplicado.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desempenho" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Tarefas Concluídas nos Últimos 7 Dias</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <Suspense fallback={<div className="h-full w-full animate-pulse rounded-md bg-muted" aria-label="Carregando gráfico" />}> 
                  <PerformanceChart data={last7} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loja" className="mt-6">
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((r) => {
                const can = stars >= r.cost;
                return (
                  <Card key={r.id} className="rounded-xl">
                    <CardHeader>
                      <CardTitle>{r.title}</CardTitle>
                      <p className="text-muted-foreground">{r.cost} estrelas ⭐</p>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        variant={can ? "hero" : "secondary"}
                        disabled={!can}
                        onClick={() => redeem(r.cost, r.title)}
                        aria-label={`Resgatar ${r.title}`}
                      >
                        Resgatar
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          </TabsContent>

          <TabsContent value="prof" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-center">Professor Virtual 🎓</CardTitle>
                <p className="text-center text-muted-foreground">Faça uma pergunta sobre seu dever de casa!</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input className="flex-1 rounded-md border bg-background px-3 py-2" placeholder="Digite sua dúvida aqui..." aria-label="Mensagem para o professor virtual" />
                  <Button variant="success">Enviar</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Recurso demonstrativo.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AppDashboard;
