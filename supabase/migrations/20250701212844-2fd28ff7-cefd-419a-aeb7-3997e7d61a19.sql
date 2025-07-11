
-- Crear tabla para el contenido del sitio
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(50) NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar contenido inicial
INSERT INTO public.site_content (section, title, subtitle, description, address, phone, email) VALUES
('hero', 'Gestión Contable Especializada', 'Más de 30 años de experiencia en consultoría agropecuaria y reestructuración empresarial', 'Sol Andrade, Contadora Pública con especialización en sector agropecuario. Ofrecemos servicios integrales de gestión contable, planificación financiera y consultoría empresarial con un enfoque cercano y práctico.', '25 de Agosto 879', '4362-0564', 'contacto@estudiosgl.com');

-- Crear tabla para artículos del blog
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar artículos iniciales
INSERT INTO public.blog_posts (title, excerpt, content, date, category, image_url) VALUES
('Nuevas Regulaciones Fiscales para el Sector Agropecuario 2024', 'Analizamos los cambios más importantes en la normativa fiscal que afectan a productores rurales y empresas agropecuarias.', 'Las nuevas regulaciones fiscales introducen cambios significativos para el sector agropecuario...', '2024-01-15', 'Fiscal', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop'),
('Planificación Financiera para Empresas Familiares', 'Estrategias clave para la gestión financiera efectiva en empresas familiares del sector agropecuario.', 'La planificación financiera en empresas familiares requiere un enfoque especializado...', '2024-01-10', 'Finanzas', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop');

-- Crear tabla para testimonios
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar testimonios iniciales
INSERT INTO public.testimonials (name, company, content, rating) VALUES
('María González', 'Estancia La Esperanza', 'Sol nos ayudó a reorganizar toda la estructura financiera de nuestra estancia. Su conocimiento del sector agropecuario es excepcional.', 5),
('Carlos Rodríguez', 'Industrias del Sur', 'Excelente profesional. Nos acompañó en el proceso de sucesión familiar de manera muy profesional y cercana.', 5);

-- Crear tabla para mensajes de contacto
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla para usuarios administradores
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insertar usuario administrador inicial
-- Contraseña: EstudioSGL2024 (se hashea en la aplicación)
INSERT INTO public.admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rKGZvEhGm9xKP8.T5wJxLeCVGnRvXxJXFvzHGzHzJPQ6yGhK4rGYG', 'admin@estudiosgl.com');

-- Habilitar RLS para todas las tablas (opcional para administrador)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (para acceso público de lectura donde sea apropiado)
CREATE POLICY "Enable read access for all users" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.testimonials FOR SELECT USING (true);
