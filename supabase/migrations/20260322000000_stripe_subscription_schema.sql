-- ============================================================
-- FluxMetric: Migration — Stripe & Subscription Schema
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Adicionar enum de planos de subscrição (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
    CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro', 'admin');
  END IF;
END$$;

-- 2. Adicionar colunas Stripe e role à tabela profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role public.subscription_plan NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- 3. Criar índices para lookup eficiente
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- 4. Atualizar trigger de criação de perfil para incluir role = 'free'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'free'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

-- Recriar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS: tracked_products visível para todos os usuários autenticados
ALTER TABLE public.tracked_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view tracked_products" ON public.tracked_products;
CREATE POLICY "Authenticated users can view tracked_products"
  ON public.tracked_products FOR SELECT
  TO authenticated
  USING (true);

-- Somente admin pode inserir/atualizar/deletar produtos
DROP POLICY IF EXISTS "Admin can manage tracked_products" ON public.tracked_products;
CREATE POLICY "Admin can manage tracked_products"
  ON public.tracked_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin')
    )
  );

-- 6. RLS: product_mention_metrics (detalhes completos somente para pro/admin)
ALTER TABLE public.product_mention_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pro users can view detailed metrics" ON public.product_mention_metrics;
CREATE POLICY "Pro users can view detailed metrics"
  ON public.product_mention_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('pro', 'admin')
    )
  );

-- 7. RLS: profiles — usuários veem apenas o próprio perfil; admin vê todos
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Função auxiliar para verificar role do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_subscription_role()
RETURNS TEXT
LANGUAGE sql STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- Função para checar se usuário é pro ou admin
CREATE OR REPLACE FUNCTION public.is_pro_user()
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT role IN ('pro', 'admin') FROM public.profiles WHERE id = auth.uid();
$$;
