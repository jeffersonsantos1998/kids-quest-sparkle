import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
// Importação do Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Carregar Stripe com a chave pública (substitua pela sua chave pública do Stripe)
const stripePromise = loadStripe("pk_test_sua_chave_publica_stripe");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast({ title: "Erro", description: "Stripe não está carregado.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Aqui você deve fazer uma chamada para sua API backend para criar um PaymentIntent
      // e obter o client_secret. Por enquanto, simularemos isso.
      const clientSecret = "simulated_client_secret"; // Substitua por chamada real ao backend

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: session?.user.email || "Usuário Rotina Mágica",
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        toast({ title: "Sucesso", description: "Pagamento realizado com sucesso! Bem-vindo ao Plano Premium." });
        navigate("/app", { replace: true });
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Erro ao processar pagamento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": {
                  color: "#888",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>
      <Button type="submit" variant="success" className="w-full" disabled={loading || !stripe}>
        {loading ? "Processando..." : "Confirmar Pagamento"}
      </Button>
    </form>
  );
};

const PaymentSetup = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <SEO title="Configurar Pagamento – Rotina Mágica" description="Configure o pagamento para o Plano Premium." />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Configurar Pagamento (Plano Premium)</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentSetup;
