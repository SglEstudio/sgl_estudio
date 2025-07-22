import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      // 1. Autenticar con Supabase Auth (tabla auth.users)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        toast({
          title: "Error de autenticación",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo autenticar el usuario.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 2. Verificar si el usuario tiene rol de admin (opcional)
      // Puedes verificar por email específico o metadata
      const adminEmails = [
"sglcrmarketing@gmail.com"
      ];

      if (!adminEmails.includes(authData.user.email || '')) {
        // Cerrar sesión si no es admin
        await supabase.auth.signOut();
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos de administrador.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 3. Opcional: Crear/actualizar registro en admin_users para tracking
      try {
        await supabase
          .from('admin_users')
          .upsert({
            id: authData.user.id,
            username: authData.user.user_metadata?.username || authData.user.email?.split('@')[0],
            email: authData.user.email,
            password_hash: 'auth_managed', // Indicar que la password la maneja Auth
            is_active: true,
            last_login: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
      } catch (adminUserError) {
        // No es crítico si falla esto
        console.log('Info: No se pudo actualizar admin_users:', adminUserError);
      }

      // 4. Guardar datos de sesión
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata?.username || authData.user.email?.split('@')[0],
        role: 'admin'
      }));

      toast({
        title: "Acceso autorizado",
        description: `Bienvenido ${authData.user.email}.`,
      });

      navigate('/admin/dashboard');

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
              Autenticación con Supabase Auth
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
                {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;