-- Permitir que cada administrador (Auth) mantenga su fila en admin_users.
-- La fila del backup con id fijo de otro proyecto chocaba con UNIQUE(username) al hacer upsert tras un login nuevo.

-- UUID de otro proyecto + filas «admin» de migraciones que chocan con UNIQUE(username) al hacer login real.
DELETE FROM public.admin_users
WHERE id = '423fa365-952b-49e9-8e5e-de6020fc91c5'
   OR password_hash <> 'auth_managed';

DROP POLICY IF EXISTS "admin_users_select_own" ON public.admin_users;
CREATE POLICY "admin_users_select_own"
  ON public.admin_users FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "admin_users_insert_own" ON public.admin_users;
CREATE POLICY "admin_users_insert_own"
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_users_update_own" ON public.admin_users;
CREATE POLICY "admin_users_update_own"
  ON public.admin_users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
