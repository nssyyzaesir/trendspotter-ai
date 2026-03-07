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
          className="relative overflow-hidden rounded-2xl bg-hero p-12 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/3 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Comece a encontrar produtos virais hoje
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/60">
              Junte-se a milhares de vendedores que já usam o TrendPulse para descobrir oportunidades antes da concorrência.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-accent text-accent-foreground hover:opacity-90">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
