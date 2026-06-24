-- ============================================================
-- CHANGE_X Team Performance Dashboard — Supabase Migration
-- Run this entire file in the Supabase SQL Editor
-- ============================================================


-- ── STEP 1: TABLES ──

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'leader', 'member')),
  approved   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_config (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL DEFAULT '',
  leader     TEXT NOT NULL DEFAULT '',
  period     TEXT NOT NULL DEFAULT '',
  aim        TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.goals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal          TEXT NOT NULL,
  kpi           TEXT,
  baseline      NUMERIC,
  target        NUMERIC,
  current_value NUMERIC,
  comment       TEXT,
  manual_status TEXT,
  approved      BOOLEAN NOT NULL DEFAULT false,
  submitted_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disciplines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline   TEXT NOT NULL,
  evidence     TEXT,
  owner        TEXT,
  status       TEXT NOT NULL DEFAULT 'amber' CHECK (status IN ('green', 'amber', 'red')),
  attention    TEXT,
  approved     BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment   TEXT NOT NULL,
  type         TEXT,
  owner        TEXT,
  due_date     DATE,
  status       TEXT NOT NULL DEFAULT 'not started' CHECK (status IN ('not started', 'in progress', 'complete')),
  note         TEXT,
  approved     BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action     TEXT NOT NULL,
  user_name  TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT 'blue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── STEP 2: HELPER FUNCTIONS (tables must exist first) ──
-- SECURITY DEFINER bypasses RLS inside the function, preventing infinite recursion
-- when these functions are used inside RLS policies on the profiles table itself.

CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_leader()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'leader')
      AND approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND approved = true
  );
$$;


-- ── STEP 3: ROW LEVEL SECURITY ──

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplines  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- profiles: own row always readable (lets unapproved users see their pending status)
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- profiles: approved users can see everyone (needed for admin panel)
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- team_config
CREATE POLICY "team_config_select" ON public.team_config
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "team_config_insert" ON public.team_config
  FOR INSERT WITH CHECK (public.is_admin_or_leader());

CREATE POLICY "team_config_update" ON public.team_config
  FOR UPDATE USING (public.is_admin_or_leader());

-- goals
CREATE POLICY "goals_select" ON public.goals
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "goals_insert" ON public.goals
  FOR INSERT WITH CHECK (public.is_approved_user());

CREATE POLICY "goals_update" ON public.goals
  FOR UPDATE USING (public.is_admin_or_leader());

CREATE POLICY "goals_delete" ON public.goals
  FOR DELETE USING (public.is_admin_or_leader());

-- disciplines
CREATE POLICY "disciplines_select" ON public.disciplines
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "disciplines_insert" ON public.disciplines
  FOR INSERT WITH CHECK (public.is_approved_user());

CREATE POLICY "disciplines_update" ON public.disciplines
  FOR UPDATE USING (public.is_admin_or_leader());

CREATE POLICY "disciplines_delete" ON public.disciplines
  FOR DELETE USING (public.is_admin_or_leader());

-- actions
CREATE POLICY "actions_select" ON public.actions
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "actions_insert" ON public.actions
  FOR INSERT WITH CHECK (public.is_approved_user());

CREATE POLICY "actions_update" ON public.actions
  FOR UPDATE USING (public.is_admin_or_leader());

CREATE POLICY "actions_delete" ON public.actions
  FOR DELETE USING (public.is_admin_or_leader());

-- activity_log
CREATE POLICY "activity_log_select" ON public.activity_log
  FOR SELECT USING (public.is_approved_user());

CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT WITH CHECK (public.is_approved_user());


-- ── STEP 4: AUTO-CREATE PROFILE TRIGGER ──
-- First user to register is automatically approved as admin.
-- All subsequent users require manual approval.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
  first_user BOOLEAN;
  req_role   TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  first_user := user_count = 0;
  req_role   := COALESCE(NEW.raw_user_meta_data->>'role', 'member');

  INSERT INTO public.profiles (id, name, email, role, approved)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN first_user THEN 'admin' ELSE req_role END,
    first_user
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── STEP 5: ENABLE REALTIME ──

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disciplines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_config;
