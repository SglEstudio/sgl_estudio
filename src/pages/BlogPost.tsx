
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  category: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  // Sample blog posts - in a real app, this would come from a database or API
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Nuevas Regulaciones Fiscales para el Sector Agropecuario 2024",
      excerpt: "Analizamos los cambios más importantes en la normativa fiscal que afectan a productores rurales y empresas agropecuarias.",
      content: `
        <h2>Introducción</h2>
        <p>Las nuevas regulaciones fiscales para el sector agropecuario introducen cambios significativos que afectan directamente a productores rurales y empresas del sector. En este artículo, analizamos las modificaciones más importantes y sus implicaciones.</p>
        
        <h3>Principales Cambios</h3>
        <p>Entre los cambios más relevantes se encuentran:</p>
        <ul>
          <li>Modificaciones en el régimen de exoneraciones para inversiones en maquinaria agrícola</li>
          <li>Nuevos criterios para la determinación de la renta presunta</li>
          <li>Actualizaciones en los plazos de presentación de declaraciones juradas</li>
          <li>Cambios en el tratamiento fiscal de las cooperativas agrarias</li>
        </ul>
        
        <h3>Impacto en el Sector</h3>
        <p>Estos cambios representan tanto oportunidades como desafíos para el sector agropecuario. Es fundamental que los productores y empresas se adapten a tiempo para aprovechar los beneficios y evitar incumplimientos.</p>
        
        <h3>Recomendaciones</h3>
        <p>Recomendamos a nuestros clientes revisar su situación fiscal actual y consultar con nuestro equipo de especialistas para desarrollar estrategias de adaptación a las nuevas normativas.</p>
      `,
      date: "2024-01-15",
      category: "Fiscal",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Planificación Financiera para Empresas Familiares",
      excerpt: "Estrategias clave para la gestión financiera efectiva en empresas familiares del sector agropecuario.",
      content: `
        <h2>La Importancia de la Planificación Financiera</h2>
        <p>La planificación financiera en empresas familiares del sector agropecuario requiere un enfoque especializado que considere tanto los aspectos familiares como los empresariales.</p>
        
        <h3>Desafíos Específicos</h3>
        <p>Las empresas familiares enfrentan desafíos únicos:</p>
        <ul>
          <li>Separación entre patrimonio familiar y empresarial</li>
          <li>Planificación de la sucesión generacional</li>
          <li>Gestión de conflictos familiares en decisiones financieras</li>
          <li>Optimización fiscal considerando la estructura familiar</li>
        </ul>
        
        <h3>Estrategias Recomendadas</h3>
        <p>Para una gestión financiera exitosa, recomendamos implementar protocolos familiares claros, establecer estructuras de gobierno corporativo adecuadas y mantener una comunicación transparente entre todos los miembros de la familia.</p>
      `,
      date: "2024-01-10",
      category: "Finanzas",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Costos y Márgenes en la Producción Agrícola",
      excerpt: "Herramientas y metodologías para el análisis de costos y optimización de márgenes en la producción agrícola.",
      content: `
        <h2>Análisis de Costos en la Producción Agrícola</h2>
        <p>El análisis de costos en la producción agrícola es fundamental para la toma de decisiones estratégicas y la optimización de márgenes de rentabilidad.</p>
        
        <h3>Componentes del Costo</h3>
        <p>Los principales componentes del costo agrícola incluyen:</p>
        <ul>
          <li>Costos directos: semillas, fertilizantes, pesticidas</li>
          <li>Costos de maquinaria y equipamiento</li>
          <li>Costos de mano de obra</li>
          <li>Costos indirectos: seguros, impuestos, servicios</li>
        </ul>
        
        <h3>Herramientas de Control</h3>
        <p>Implementamos sistemas de control de costos que permiten un seguimiento detallado de cada componente, facilitando la identificación de oportunidades de mejora y optimización.</p>
      `,
      date: "2024-01-05",
      category: "Costos",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Sucesión Empresarial: Preparando el Futuro",
      excerpt: "Guía completa para planificar la sucesión en empresas familiares del sector agropecuario.",
      content: `
        <h2>La Planificación de la Sucesión Empresarial</h2>
        <p>La planificación de la sucesión empresarial es crucial para garantizar la continuidad y el éxito de las empresas familiares del sector agropecuario.</p>
        
        <h3>Elementos Clave</h3>
        <p>Un plan de sucesión exitoso debe considerar:</p>
        <ul>
          <li>Identificación y preparación de sucesores</li>
          <li>Valoración adecuada de los activos empresariales</li>
          <li>Estructura fiscal óptima para la transición</li>
          <li>Protocolo familiar para la gestión del cambio</li>
        </ul>
        
        <h3>Proceso de Implementación</h3>
        <p>El proceso debe iniciarse con suficiente anticipación, involucrando a todos los miembros de la familia y estableciendo criterios claros para la transición del liderazgo.</p>
      `,
      date: "2023-12-28",
      category: "Sucesión",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(id || ''));
    setPost(foundPost || null);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-wood-900 mb-4">Artículo no encontrado</h1>
            <p className="text-wood-700 mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
            <Button onClick={() => navigate('/')} className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8 border-wood-300 text-wood-700 hover:bg-wood-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-wood-100 text-wood-800">
                <Tag className="h-3 w-3 mr-1" />
                {post.category}
              </span>
              <div className="flex items-center text-wood-600">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(post.date)}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-wood-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-wood-700 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article image */}
          {post.image && (
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-wood-900 prose-p:text-wood-700 prose-li:text-wood-700 prose-strong:text-wood-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer section */}
          <div className="mt-12 pt-8 border-t border-wood-200">
            <div className="bg-wood-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-wood-900 mb-2">
                ¿Necesitas asesoramiento profesional?
              </h3>
              <p className="text-wood-700 mb-4">
                Nuestro equipo de contadoras especializadas en el sector agropecuario está listo para ayudarte.
              </p>
              <Button className="btn-primary">
                Contactar ahora
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
