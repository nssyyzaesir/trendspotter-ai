import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Redireciona se o usuário não tiver este plano ou superior */
  requiredPlan?: SubscriptionPlan;
  /** Redireciona se o usuário não tiver este role exato (retrocompatibilidade) */
  requiredRole?: string;
}

const planHierarchy: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 1,
  admin: 2,
};

const ProtectedRoute = ({ children, requiredPlan, requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Gate por plano (free → pro → admin hierarquia)
  if (requiredPlan && role) {
    const userLevel = planHierarchy[role] ?? 0;
    const requiredLevel = planHierarchy[requiredPlan] ?? 0;
    if (userLevel < requiredLevel) {
      return <Navigate to="/pricing" replace />;
    }
  }

  // Gate por role exato (retrocompatibilidade com requiredRole="admin")
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
