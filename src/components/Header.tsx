import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Si estamos en cualquier página que no sea la principal, navegar a / primero
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Si ya estamos en la página principal, hacer scroll directo
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <img 
              src="/lovable-uploads/704c3aee-dcbe-4299-a27c-e871076c6c7e.png" 
              alt="SGL Contadores Asociados" 
              className="h-[10rem] w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-wood-700 hover:text-wood-900 font-medium transition-colors"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="text-wood-700 hover:text-wood-900 font-medium transition-colors"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('sobre-sol')}
              className="text-wood-700 hover:text-wood-900 font-medium transition-colors"
            >
              Sobre Nosotros
            </button>
            <button 
              onClick={() => navigate('/blog')}
              className="text-wood-700 hover:text-wood-900 font-medium transition-colors"
            >
              Blog
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-wood-700 hover:text-wood-900 font-medium transition-colors"
            >
              Contacto
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-wood-600">
              <Phone className="h-4 w-4" />
              <span>4362-0564</span>
            </div>
            <Button 
              onClick={() => scrollToSection('contacto')}
              className="btn-primary"
            >
              Solicitar Consulta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-wood-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-wood-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-left text-wood-700 hover:text-wood-900 font-medium py-2 transition-colors"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="text-left text-wood-700 hover:text-wood-900 font-medium py-2 transition-colors"
              >
                Servicios
              </button>
              <button 
                onClick={() => scrollToSection('sobre-sol')}
                className="text-left text-wood-700 hover:text-wood-900 font-medium py-2 transition-colors"
              >
                Sobre Nosotros
              </button>
              <button 
                onClick={() => navigate('/blog')}
                className="text-left text-wood-700 hover:text-wood-900 font-medium py-2 transition-colors"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="text-left text-wood-700 hover:text-wood-900 font-medium py-2 transition-colors"
              >
                Contacto
              </button>
              <div className="pt-4 border-t border-wood-200">
                <div className="flex items-center space-x-2 text-sm text-wood-600 mb-3">
                  <Phone className="h-4 w-4" />
                  <span>4362-0564</span>
                </div>
                <Button 
                  onClick={() => scrollToSection('contacto')}
                  className="btn-primary w-full"
                >
                  Solicitar Consulta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;