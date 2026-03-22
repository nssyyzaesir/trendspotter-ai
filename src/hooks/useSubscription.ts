import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SubscriptionStatus {
  plan: "free" | "pro" | "admin" | null;
  isPro: boolean;
  isAdmin: boolean;
  stripeSubscriptionId: string | null;
  stripeSubscriptionStatus: string | null;
  planExpiresAt: string | null;
  loading: boolean;
}

/**
 * Hook para verificar e acompanhar o status da assinatura do usuário em tempo real.
 * Combina os dados do useAuth com dados extras da tabela profiles.
 */
export function useSubscription(): SubscriptionStatus {
  const { user, role, isPro, isAdmin, stripeSubscriptionId, loading: authLoading } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setSubscriptionStatus(null);
      setPlanExpiresAt(null);
      setLoading(false);
      return;
    }

    // Busca dados extras de subscrição
    supabase
      .from("profiles")
      .select("stripe_subscription_status, plan_expires_at")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSubscriptionStatus(data?.stripe_subscription_status ?? null);
        setPlanExpiresAt(data?.plan_expires_at ?? null);
        setLoading(false);
      });

    // Listener em tempo real para mudanças no perfil (quando Stripe atualiza via webhook)
    const channel = supabase
      .channel(`profile:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as {
            stripe_subscription_status?: string;
            plan_expires_at?: string;
          };
          if (updated.stripe_subscription_status !== undefined) {
            setSubscriptionStatus(updated.stripe_subscription_status);
          }
          if (updated.plan_expires_at !== undefined) {
            setPlanExpiresAt(updated.plan_expires_at);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authLoading]);

  return {
    plan: role,
    isPro,
    isAdmin,
    stripeSubscriptionId,
    stripeSubscriptionStatus: subscriptionStatus,
    planExpiresAt,
    loading: authLoading || loading,
  };
}
