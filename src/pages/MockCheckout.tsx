import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, CreditCard, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const MockCheckout = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fake card details state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleNext = () => setStep(2);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden data-grid">
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <Link to="/pricing" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        TrendPulse
      </Link>

      <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl relative z-10">
        <div className="grid md:grid-cols-5 min-h-[500px]">
          
          {/* Left Panel: Selected Plan Info */}
          <div className="md:col-span-2 bg-muted/30 p-8 border-r border-border/50 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-6">
                <Zap className="h-3 w-3" />
                Plano Pro Selecionado
              </div>
              
              <h2 className="font-display text-2xl font-bold">TrendPulse Pro</h2>
              <p className="text-muted-foreground text-sm mt-2">Você está atualizando para o plano profissional. Tenha acesso completo a todos os dados virais.</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-4">
                  <span className="text-muted-foreground">Faturamento</span>
                  <span className="font-medium">Mensal</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">€29.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">€29<span className="text-sm text-foreground">/mês</span></span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground opacity-70">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Conexão 100% criptografada e segura. Sandbox mode ativado.
            </div>
          </div>

          {/* Right Panel: Checkout Steps */}
          <div className="md:col-span-3 p-8 bg-card relative">
            <AnimatePresence mode="wait">
              {/* Step 1: Review / User Details */}
              {step === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-bold mb-6">Confirmar Detalhes</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Email Associado</label>
                      <Input value={user?.email || "usuario@exemplo.com"} disabled className="mt-1 bg-muted/50" />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-accent mb-2">
                         Mock Mode (Sandbox)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Nenhuma cobrança real será feita. Insira dados fictícios na próxima etapa para testar o fluxo.
                      </p>
                    </div>

                    <Button className="w-full mt-6 bg-gradient-primary group" onClick={handleNext}>
                      Continuar para Pagamento
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setStep(1)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Voltar</button>
                    <span className="text-muted-foreground">/</span>
                    <h3 className="font-display text-xl font-bold">Pagamento</h3>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Nome no Cartão</label>
                      <Input required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="João da Silva" className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Número do Cartão (Simulação)</label>
                      <div className="relative mt-1">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="pl-9" maxLength={19} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Validade</label>
                        <Input required value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/AA" className="mt-1" maxLength={5} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">CVC</label>
                        <Input required type="password" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" className="mt-1" maxLength={4} />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-8 bg-gradient-primary gap-2" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Processando Simulador...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" /> Finalizar Assinatura Mock
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div key="step-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                  <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-2">Sucesso!</h3>
                  <p className="text-muted-foreground mb-8">Sua assinatura mock foi confirmada. Você agora tem acesso Pro.</p>
                  
                  <Button onClick={() => navigate("/dashboard?checkout=success")} className="w-full max-w-xs">
                    Ir para o Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
