import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  category: string;
}

const BlogSection = () => {
  const navigate = useNavigate();
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Nuevas Regulaciones Fiscales para el Sector Agropecuario 2024",
      excerpt: "Analizamos los cambios más importantes en la normativa fiscal que afectan a productores rurales y empresas agropecuarias.",
      content: "Las nuevas regulaciones fiscales introducen cambios significativos...",
      date: "2024-01-15",
      category: "Fiscal",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Planificación Financiera para Empresas Familiares",
      excerpt: "Estrategias clave para la gestión financiera efectiva en empresas familiares del sector agropecuario.",
      content: "La planificación financiera en empresas familiares requiere...",
      date: "2024-01-10",
      category: "Finanzas",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Costos y Márgenes en la Producción Agrícola",
      excerpt: "Herramientas y metodologías para el análisis de costos y optimización de márgenes en la producción agrícola.",
      content: "El análisis de costos en la producción agrícola es fundamental...",
      date: "2024-01-05",
      category: "Costos",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Sucesión Empresarial: Preparando el Futuro",
      excerpt: "Guía completa para planificar la sucesión en empresas familiares del sector agropecuario.",
      content: "La planificación de la sucesión empresarial es crucial...",
      date: "2023-12-28",
      category: "Sucesión",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-wood-50 to-sage-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-wood-900 mb-4">
            Novedades y Artículos
          </h2>
          <p className="text-xl text-wood-700 max-w-3xl mx-auto">
            Manténgase actualizado con las últimas novedades y artículos generados por nuestro equipo de profesionales.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-wood-200 hover:shadow-lg transition-all duration-300 hover:border-wood-300">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-wood-600 bg-wood-100 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center text-wood-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.date)}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold text-wood-900 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-wood-700 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-wood-300 text-wood-700 hover:bg-wood-50"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Leer más
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 border-wood-300 hover:bg-wood-50" />
            <CarouselNext className="hidden md:flex -right-4 border-wood-300 hover:bg-wood-50" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <Button className="btn-primary">
            Ver todos los artículos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
