import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  AlertCircle, 
  Loader2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el artículo desde Supabase
  const fetchBlogPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Artículo no encontrado');
      }

      setPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    } else {
      setError('ID de artículo no válido');
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const scrollToContact = () => {
    navigate('/', { state: { scrollTo: 'contacto' } });
  };

  // Función para compartir en redes sociales
  const sharePost = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const text = `${post.title} - ${post.excerpt}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Podrías mostrar un toast de confirmación aquí
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="min-h-screen">
      <Header />
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-10 w-32 mb-8" />
          
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </header>

          <Skeleton className="w-full h-64 md:h-96 mb-8 rounded-lg" />

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );

  // Componente de error
  const ErrorDisplay = () => (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-900 mb-4">
              {error?.includes('no encontrado') ? 'Artículo no encontrado' : 'Error al cargar el artículo'}
            </h1>
            <p className="text-red-700 mb-6">
              {error || 'Ocurrió un error inesperado al cargar el artículo.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                className="btn-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
              {id && (
                <Button 
                  onClick={() => fetchBlogPost(id)}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Intentar nuevamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Estados de loading y error
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !post) {
    return <ErrorDisplay />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/blog')}
            className="mb-8 border-wood-300 text-wood-700 hover:bg-wood-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al blog
          </Button>

          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-wood-100 text-wood-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category}
                </span>
                <div className="flex items-center text-wood-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(post.date)}
                </div>
              </div>
              
              {/* Botón de compartir en header */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-wood-300 text-wood-700 hover:bg-wood-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => sharePost('facebook')}
                    className="cursor-pointer"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Compartir en Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('twitter')}
                    className="cursor-pointer"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                    Compartir en Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('linkedin')}
                    className="cursor-pointer"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    Compartir en LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('copy')}
                    className="cursor-pointer"
                  >
                    <Link2 className="h-4 w-4 mr-2 text-wood-600" />
                    Copiar enlace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <h1 className="text-4xl font-bold text-wood-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-wood-700 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article image - MEJORADA */}
          {post.image_url && (
            <div className="mb-8 bg-wood-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '400px' }}>
              <img 
                src={post.image_url} 
                alt={post.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // Ocultar imagen si no carga
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none prose-headings:text-wood-900 prose-p:text-wood-700 prose-li:text-wood-700 prose-strong:text-wood-900 prose-a:text-wood-600 hover:prose-a:text-wood-800">
            {/* Renderizar contenido HTML de forma segura */}
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>

          {/* Article metadata */}
          <div className="mt-8 pt-6 border-t border-wood-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-wood-600">
                <span>Publicado el {formatDate(post.date)}</span>
                {post.updated_at !== post.created_at && (
                  <span>• Actualizado el {formatDate(post.updated_at)}</span>
                )}
                <span>• Categoría: {post.category}</span>
              </div>
              
              {/* Segundo botón de compartir en metadata */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-wood-300 text-wood-700 hover:bg-wood-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => sharePost('facebook')}
                    className="cursor-pointer"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Compartir en Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('twitter')}
                    className="cursor-pointer"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                    Compartir en Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('linkedin')}
                    className="cursor-pointer"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    Compartir en LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => sharePost('copy')}
                    className="cursor-pointer"
                  >
                    <Link2 className="h-4 w-4 mr-2 text-wood-600" />
                    Copiar enlace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Call to action section */}
          <div className="mt-12 pt-8 border-t border-wood-200">
            <div className="bg-wood-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-wood-900 mb-2">
                ¿Necesitas asesoramiento profesional?
              </h3>
              <p className="text-wood-700 mb-4">
                Nuestro equipo de contadoras especializadas en el sector agropecuario está listo para ayudarte con tus necesidades contables y financieras.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="btn-primary"
                  onClick={scrollToContact}
                >
                  Contactar ahora
                </Button>
                <Button 
                  variant="outline"
                  className="border-wood-300 text-wood-700 hover:bg-wood-100"
                  onClick={() => navigate('/')}
                >
                  Ver más servicios
                </Button>
              </div>
            </div>
          </div>

          {/* Related articles section */}
          <div className="mt-12 pt-8 border-t border-wood-200">
            <h3 className="text-lg font-semibold text-wood-900 mb-4">
              Artículos relacionados
            </h3>
            <div className="bg-wood-50 rounded-lg p-6 text-center">
              <p className="text-wood-600 mb-4">
                Descubre más contenido especializado en nuestro blog
              </p>
              <Button 
                variant="outline"
                className="border-wood-300 text-wood-700 hover:bg-wood-100"
                onClick={() => navigate('/blog')}
              >
                Ver todos los artículos
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