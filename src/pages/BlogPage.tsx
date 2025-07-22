import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  ArrowRight, 
  Search, 
  Filter, 
  AlertCircle, 
  BookOpen,
  ArrowLeft,
  Tag
} from 'lucide-react';
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

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  
  const POSTS_PER_PAGE = 6;

  // Función para obtener todos los artículos
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setBlogPosts(data || []);
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set((data || []).map(post => post.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar posts
  const filterPosts = () => {
    let filtered = blogPosts;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset a la primera página al filtrar
  };

  // Actualizar URL params
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  };

  // Cargar artículos al montar el componente
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Filtrar posts cuando cambian los filtros
  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, selectedCategory]);

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    updateUrlParams();
  }, [searchTerm, selectedCategory, currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Paginación
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="border-wood-200">
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
  );

  // Componente de error
  const ErrorDisplay = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-900 mb-2">
          Error al cargar artículos
        </h3>
        <p className="text-red-700 mb-6">{error}</p>
        <Button 
          onClick={fetchBlogPosts}
          className="btn-primary"
        >
          Intentar nuevamente
        </Button>
      </div>
    </div>
  );

  // Componente cuando no hay resultados
  const EmptyState = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-wood-50 border border-wood-200 rounded-lg p-8">
        <BookOpen className="h-16 w-16 text-wood-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-wood-900 mb-2">
          {searchTerm || selectedCategory !== 'all' 
            ? 'No se encontraron artículos' 
            : 'No hay artículos disponibles'
          }
        </h3>
        <p className="text-wood-600 mb-6">
          {searchTerm || selectedCategory !== 'all'
            ? 'Intenta con otros términos de búsqueda o filtros.'
            : 'Aún no se han publicado artículos. ¡Pronto tendremos contenido interesante!'
          }
        </p>
        {(searchTerm || selectedCategory !== 'all') && (
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            variant="outline"
            className="border-wood-300 text-wood-700 hover:bg-wood-100"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Header de la página */}
          <div className="text-center mb-12 mt-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-wood-900 mb-6">
              Blog y Artículos
            </h1>
            <p className="text-xl text-wood-700 max-w-3xl mx-auto">
              Mantente actualizado con las últimas novedades, consejos y análisis 
              de nuestro equipo de especialistas en contabilidad y finanzas.
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              {/* Barra de búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wood-500" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-wood-200 focus:border-wood-500"
                />
              </div>
              
              {/* Filtro de categorías */}
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wood-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-wood-200 rounded-md focus:border-wood-500 focus:outline-none focus:ring-1 focus:ring-wood-500 bg-white"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Contador de resultados */}
            {!loading && (
              <div className="text-center mt-4 text-wood-600">
                {filteredPosts.length === 0 
                  ? 'No se encontraron artículos'
                  : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}`
                }
              </div>
            )}
          </div>

          {/* Contenido principal */}
          {loading && <LoadingSkeleton />}
          
          {error && !loading && <ErrorDisplay />}
          
          {!loading && !error && filteredPosts.length === 0 && <EmptyState />}
          
          {!loading && !error && currentPosts.length > 0 && (
            <>
              {/* Grid de artículos */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="h-full border-wood-200 hover:shadow-lg transition-all duration-300 hover:border-wood-300 cursor-pointer group"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={post.image_url || '/placeholder.svg'} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center text-xs font-semibold text-wood-600 bg-wood-100 px-2 py-1 rounded">
                          <Tag className="h-3 w-3 mr-1" />
                          {post.category}
                        </span>
                        <div className="flex items-center text-wood-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.date)}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold text-wood-900 line-clamp-2 group-hover:text-wood-700 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-wood-700 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-wood-600 text-sm font-medium group-hover:text-wood-800 transition-colors">
                        Leer más
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-wood-300 text-wood-700 hover:bg-wood-50 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      
                      // Mostrar solo páginas cercanas a la actual
                      if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                        if (page === currentPage - 3 || page === currentPage + 3) {
                          return <span key={page} className="px-2 text-wood-500">...</span>;
                        }
                        if (Math.abs(page - currentPage) > 2) {
                          return null;
                        }
                      }
                      
                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={isCurrentPage 
                            ? "btn-primary" 
                            : "border-wood-300 text-wood-700 hover:bg-wood-50"
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-wood-300 text-wood-700 hover:bg-wood-50 disabled:opacity-50"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Call to action */}
          {!loading && !error && blogPosts.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-wood-50 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-wood-900 mb-4">
                  ¿Te interesan estos temas?
                </h3>
                <p className="text-wood-700 mb-6">
                  Nuestro equipo de especialistas puede ayudarte con asesoramiento 
                  personalizado en todas estas áreas.
                </p>
                <Button 
                  className="btn-primary"
                  onClick={() => navigate('/', { state: { scrollTo: 'contacto' } })}
                >
                  Contactar ahora
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;