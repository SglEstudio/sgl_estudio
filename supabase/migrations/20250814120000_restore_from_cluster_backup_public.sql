-- Restauración parcial desde db_cluster-14-08-2025 (solo app: public + políticas alineadas al dump).
-- El dump completo del clúster NO es compatible con `psql` contra proyectos Supabase (roles y esquemas internos ya existen).

-- Función del dump (no venía con trigger en el backup).
CREATE OR REPLACE FUNCTION public.handle_new_admin_user() RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE id = NEW.id) THEN
    INSERT INTO public.admin_users (
      id,
      username,
      email,
      password_hash,
      is_active,
      created_at
    ) VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
      ),
      NEW.email,
      'EstudioSGL2025',
      true,
      NEW.created_at
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating admin user: %', SQLERRM;
    RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_admin_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_admin_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_admin_user() TO service_role;

-- RLS: políticas adicionales del dump (la migración inicial solo tenía SELECT público en algunas tablas).
DROP POLICY IF EXISTS "DELETE" ON public.contact_messages;
CREATE POLICY "DELETE" ON public.contact_messages FOR DELETE TO authenticated USING ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS "INSERT" ON public.contact_messages;
CREATE POLICY "INSERT" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "SELECT" ON public.contact_messages;
CREATE POLICY "SELECT" ON public.contact_messages FOR SELECT TO authenticated USING ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS "UPDATE" ON public.contact_messages;
CREATE POLICY "UPDATE" ON public.contact_messages FOR UPDATE TO authenticated USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS delete ON public.blog_posts;
CREATE POLICY delete ON public.blog_posts FOR DELETE TO authenticated USING ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS insert ON public.blog_posts;
CREATE POLICY insert ON public.blog_posts FOR INSERT TO authenticated WITH CHECK ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS update ON public.blog_posts;
CREATE POLICY update ON public.blog_posts FOR UPDATE TO authenticated USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));

-- Bucket y políticas de storage como en el dump.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public', 'public', true, 52428800, ARRAY['image/*']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING ((bucket_id = 'public'::text));

DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE TO authenticated USING ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS "update_policy 1iv6gyx_0" ON storage.objects;
CREATE POLICY "update_policy 1iv6gyx_0" ON storage.objects FOR UPDATE TO authenticated USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));

-- Datos public del dump (blog_posts y testimonials estaban vacíos en la fecha del backup).
INSERT INTO public.site_content (id, section, title, subtitle, description, address, phone, email, created_at, updated_at)
VALUES (
  'c9f4206a-1ea1-4840-8722-fdfc010900bf',
  'hero',
  'Asesoría Contable Integral',
  'Más de 30 años trabajando con  empresas familiares,' || chr(10) || '                  emprendimientos rurales, comercios y profesionales independientes.',
  '   Equipo de contadoras con una mirada amplia, práctica y' || chr(10) || '              comprometida con la realidad de quienes confían en nuestro' || chr(10) || '              trabajo. En Estudio SGL entendemos la contabilidad no como un fin' || chr(10) || '              en sí mismo, sino como una herramienta estratégica para ordenar,' || chr(10) || '              proyectar y decidir mejor.',
  '25 de Agosto 879',
  '4362-0564',
  'contacto@estudiosgl.com',
  '2025-07-01 21:28:36.225872+00'::timestamptz,
  '2025-07-01 21:28:36.225872+00'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  section = EXCLUDED.section,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.site_content
WHERE section = 'hero'
  AND id IS DISTINCT FROM 'c9f4206a-1ea1-4840-8722-fdfc010900bf'::uuid;

INSERT INTO public.contact_messages (id, name, email, phone, subject, message, status, created_at)
VALUES (
  'b2e1c425-2fa0-47bd-9ff0-61b6921b4c4d',
  'abril bidegain',
  'profeabrilbide@gmail.com',
  NULL,
  'Consulta desde formulario web',
  'HOLA COMO ESTAN MEJOR EQUIPO DE CONTADORAS',
  'unread',
  '2025-07-22 21:48:14.789498+00'::timestamptz
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_users (id, username, password_hash, email, is_active, created_at, last_login)
VALUES
  (
    'be6fd110-fe2c-4593-98fa-8f8553c8a0d3',
    'admin',
    'EstudioSGL2024',
    'admin@estudiosgl.com',
    true,
    '2025-07-22 00:30:09.306216+00'::timestamptz,
    NULL
  ),
  (
    '423fa365-952b-49e9-8e5e-de6020fc91c5',
    'sglcrmarketing',
    'auth_managed',
    'sglcrmarketing@gmail.com',
    true,
    '2025-07-22 00:35:58.841966+00'::timestamptz,
    '2025-07-22 00:36:42.929+00'::timestamptz
  )
ON CONFLICT (username) DO UPDATE SET
  id = EXCLUDED.id,
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active,
  created_at = EXCLUDED.created_at,
  last_login = EXCLUDED.last_login;
