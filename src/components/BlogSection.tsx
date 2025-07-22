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
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

const BlogSection = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los artículos desde Supabase
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false })
        .limit(6); // Limitar a 6 artículos para el carousel

      if (error) {
        throw error;
      }

      setBlogPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar artículos al montar el componente
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="h-full border-wood-200">
            <Skeleton className="aspect-video w-full rounded-t-lg" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Componente de error
  const ErrorDisplay = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error al cargar artículos
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <Button 
          onClick={fetchBlogPosts}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          Intentar nuevamente
        </Button>
      </div>
    </div>
  );

  // Componente cuando no hay artículos
  const EmptyState = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-wood-50 border border-wood-200 rounded-lg p-8">
        <div className="w-16 h-16 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-wood-600" />
        </div>
        <h3 className="text-lg font-semibold text-wood-900 mb-2">
          No hay artículos disponibles
        </h3>
        <p className="text-wood-600 mb-4">
          Aún no se han publicado artículos. ¡Pronto tendremos contenido interesante para ti!
        </p>
      </div>
    </div>
  );

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

        {/* Estados de carga, error y contenido */}
        {loading && <LoadingSkeleton />}
        
        {error && !loading && <ErrorDisplay />}
        
        {!loading && !error && blogPosts.length === 0 && <EmptyState />}
        
        {!loading && !error && blogPosts.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Mostrar en carousel solo si hay más de 3 artículos */}
            {blogPosts.length > 3 ? (
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {blogPosts.map((post) => (
                    <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full border-wood-200 hover:shadow-lg transition-all duration-300 hover:border-wood-300">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={post.image_url || '/placeholder.svg'} 
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback si la imagen no carga
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
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
            ) : (
              /* Grid centrado para 1-3 artículos */
              <div className={`grid gap-6 ${
                blogPosts.length === 1 
                  ? 'grid-cols-1 max-w-md mx-auto' 
                  : blogPosts.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'
              }`}>
                {blogPosts.map((post) => (
                  <Card key={post.id} className="h-full border-wood-200 hover:shadow-lg transition-all duration-300 hover:border-wood-300">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={post.image_url || '/placeholder.svg'} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback si la imagen no carga
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botón para ver todos los artículos */}
        {!loading && !error && blogPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              className="btn-primary"
              onClick={() => navigate('/blog')}
            >
              Ver todos los artículos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;