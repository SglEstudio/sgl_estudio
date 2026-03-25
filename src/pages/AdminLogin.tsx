import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const DEFAULT_ADMIN_EMAILS = 'sglcrmarketing@gmail.com,admin@estudiosgl.com';

function parseAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
  const source = raw?.trim() ? raw : DEFAULT_ADMIN_EMAILS;
  return source
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const allowAdminSignup = import.meta.env.VITE_ALLOW_ADMIN_SIGNUP === 'true';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const adminEmails = parseAdminEmails();

  const finishAdminSession = async (user: User) => {
    if (!adminEmails.includes((user.email ?? '').toLowerCase())) {
      await supabase.auth.signOut();
      toast({
        title: 'Acceso denegado',
        description: `Este correo no está autorizado para el panel. Añádelo en VITE_ADMIN_EMAILS o usa uno de la lista permitida.`,
        variant: 'destructive',
      });
      return false;
    }

    const { error: upsertErr } = await supabase.from('admin_users').upsert(
      {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'admin',
        email: user.email,
        password_hash: 'auth_managed',
        is_active: true,
        last_login: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (upsertErr) console.warn('admin_users upsert:', upsertErr.message);

    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem(
      'adminUser',
      JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        role: 'admin',
      }),
    );
    toast({
      title: 'Acceso autorizado',
      description: `Bienvenido ${user.email}.`,
    });
    navigate('/admin/dashboard');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (authError) {
        const hint =
          authError.message.includes('Invalid login') || authError.message.includes('credentials')
            ? ' Si es un proyecto nuevo, el usuario aún no existe en Authentication: usa «Registrar admin» abajo (si está activado) o créalo en el dashboard de Supabase.'
            : '';
        toast({
          title: 'Error de autenticación',
          description: `${authError.message}.${hint}`,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo autenticar el usuario.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      await finishAdminSession(authData.user);
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleRegisterAdmin = async () => {
    if (!allowAdminSignup) return;
    setIsLoading(true);
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!adminEmails.includes(email)) {
      toast({
        title: 'Correo no permitido',
        description:
          'Solo se puede registrar un correo de la lista de administradores (variable VITE_ADMIN_EMAILS).',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Contraseña corta',
        description: 'Usa al menos 6 caracteres (requisito de Supabase Auth).',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        toast({
          title: 'No se pudo registrar',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (data.session && data.user) {
        await finishAdminSession(data.user);
      } else if (data.user) {
        toast({
          title: 'Revisa tu correo',
          description:
            'Si el proyecto exige confirmar el email, abre el enlace y luego vuelve a iniciar sesión.',
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'No se pudo completar el registro.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 to-wood-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 border-wood-300 text-wood-700 hover:bg-wood-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al sitio
        </Button>

        {/* Login Card */}
        <Card className="border-wood-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-wood-600" />
            </div>
            <CardTitle className="text-2xl text-wood-900">
              Panel de Administración
            </CardTitle>
            <p className="text-wood-600 text-sm">
              Entra con el mismo correo y contraseña que en Supabase → Authentication → Users.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email de administrador"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-wood-200 focus:border-wood-500"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-wood-200 focus:border-wood-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wood-500 hover:text-wood-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Iniciar sesión'}
              </Button>

              {allowAdminSignup && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-wood-300"
                  disabled={isLoading}
                  onClick={handleRegisterAdmin}
                >
                  Registrar administrador (primer acceso en este proyecto)
                </Button>
              )}
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;