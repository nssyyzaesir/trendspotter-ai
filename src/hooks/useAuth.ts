import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

interface AuthState {
  user: User | null;
  session: Session | null;
  role: SubscriptionPlan | null;
  isPro: boolean;
  isAdmin: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  loading: boolean;
}

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role, stripe_customer_id, stripe_subscription_id")
    .eq("id", userId)
    .single();
  return data;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    isPro: false,
    isAdmin: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    loading: true,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        let profileData: { role: SubscriptionPlan; stripe_customer_id: string | null; stripe_subscription_id: string | null } | null = null;
        if (session?.user) {
          profileData = await fetchProfile(session.user.id) as typeof profileData;
        }

        setState({
          user: session?.user ?? null,
          session,
          role: profileData?.role ?? null,
          isPro: profileData?.role === "pro" || profileData?.role === "admin",
          isAdmin: profileData?.role === "admin",
          stripeCustomerId: profileData?.stripe_customer_id ?? null,
          stripeSubscriptionId: profileData?.stripe_subscription_id ?? null,
          loading: false,
        });
      }
    );

    // Initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profileData: { role: SubscriptionPlan; stripe_customer_id: string | null; stripe_subscription_id: string | null } | null = null;
      if (session?.user) {
        profileData = await fetchProfile(session.user.id) as typeof profileData;
      }

      setState({
        user: session?.user ?? null,
        session,
        role: profileData?.role ?? null,
        isPro: profileData?.role === "pro" || profileData?.role === "admin",
        isAdmin: profileData?.role === "admin",
        stripeCustomerId: profileData?.stripe_customer_id ?? null,
        stripeSubscriptionId: profileData?.stripe_subscription_id ?? null,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      role: null,
      isPro: false,
      isAdmin: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      loading: false,
    });
  };

  return { ...state, signOut };
}
