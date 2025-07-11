
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
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

    // Simple authentication (in a real app, this would be more secure)
    if (formData.username === 'admin' && formData.password === 'EstudioSGL2024') {
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al panel de administración.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos.",
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
              Acceso restringido solo para administradores
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  name="username"
                  placeholder="Usuario"
                  value={formData.username}
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

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-wood-50 rounded-lg border border-wood-200">
              <p className="text-xs text-wood-600 mb-2 font-medium">Credenciales de demostración:</p>
              <p className="text-xs text-wood-500">Usuario: admin</p>
              <p className="text-xs text-wood-500">Contraseña: EstudioSGL2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
