import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-hero p-12 text-center shadow-2xl sm:p-20 border border-primary/20"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <h2 className="mb-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Pronto para dominar o <span className="text-gradient">TikTok?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
              Junte-se aos vendedores e marcas que já estão usando inteligência de dados para encontrar seu próximo produto milionário.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="h-14 bg-gradient-primary px-8 text-base font-bold text-white shadow-glow hover:scale-105 hover:opacity-90 transition-all duration-300">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">Não é necessário cartão de crédito. Teste grátis por 7 dias.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
