import { useState } from "react";
import { User, Bell, Palette, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Settings = () => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;

      await supabase.from("profiles").update({ full_name: fullName }).eq("id", user?.id);
      toast.success("Perfil atualizado!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências e conta.</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Perfil</h3>
              <p className="text-xs text-muted-foreground">Informações da sua conta</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Nome completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input value={user?.email || ""} disabled className="mt-1.5 bg-muted" />
            </div>
            <div>
              <Label className="text-sm">Tipo de conta</Label>
              <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Shield className="h-3.5 w-3.5" />
                {role === "admin" ? "Administrador" : "Cliente"}
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Aparência</h3>
              <p className="text-xs text-muted-foreground">Personalize a interface</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-sm font-medium">Modo Escuro</p>
              <p className="text-xs text-muted-foreground">Alterne entre tema claro e escuro</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Assinatura</h3>
              <p className="text-xs text-muted-foreground">Gerencie seu plano</p>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-1 text-sm font-semibold">Plano atual: <span className="text-primary">Gratuito</span></p>
            <p className="mb-4 text-xs text-muted-foreground">Faça upgrade para desbloquear recursos avançados.</p>
            <Link to="/#pricing">
              <Button variant="outline" size="sm">Ver Planos</Button>
            </Link>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Notificações</h3>
              <p className="text-xs text-muted-foreground">Configure seus alertas</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Novos produtos em alta", desc: "Receba quando um produto atingir score alto" },
              { label: "Relatórios semanais", desc: "Resumo semanal das tendências" },
              { label: "Alertas de saturação", desc: "Quando um produto começa a saturar" },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
