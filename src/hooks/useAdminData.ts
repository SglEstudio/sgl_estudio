import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image_url?: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

export const useAdminData = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    hero: { title: '', subtitle: '', description: '' },
    contact: { address: '', phone: '', email: '' }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch blog posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (postsError) throw postsError;
      setBlogPosts(posts || []);

      // Fetch testimonials
      const { data: testimonialData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialData || []);

      // Fetch site content
      const { data: contentData, error: contentError } = await supabase
        .from('site_content')
        .select('*');

      if (contentError) throw contentError;
      
      const heroContent = contentData?.find(item => item.section === 'hero');
      if (heroContent) {
        setSiteContent({
          hero: {
            title: heroContent.title || '',
            subtitle: heroContent.subtitle || '',
            description: heroContent.description || ''
          },
          contact: {
            address: heroContent.address || '',
            phone: heroContent.phone || '',
            email: heroContent.email || ''
          }
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add blog post
  const addBlogPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      
      setBlogPosts(prev => [data, ...prev]);
      toast({
        title: "Artículo agregado",
        description: "El artículo ha sido agregado correctamente.",
      });
    } catch (error) {
      console.error('Error adding blog post:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el artículo",
        variant: "destructive",
      });
    }
  };

  // Update blog post
  const updateBlogPost = async (id: string, post: Omit<BlogPost, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setBlogPosts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Artículo actualizado",
        description: "El artículo ha sido actualizado correctamente.",
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el artículo",
        variant: "destructive",
      });
    }
  };

  // Delete blog post
  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      toast({
        title: "Artículo eliminado",
        description: "El artículo ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo",
        variant: "destructive",
      });
    }
  };

  // Add testimonial
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single();

      if (error) throw error;
      
      setTestimonials(prev => [data, ...prev]);
      toast({
        title: "Testimonio agregado",
        description: "El testimonio ha sido agregado correctamente.",
      });
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el testimonio",
        variant: "destructive",
      });
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      toast({
        title: "Testimonio eliminado",
        description: "El testimonio ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el testimonio",
        variant: "destructive",
      });
    }
  };

  // Update site content
  const updateSiteContent = async (content: SiteContent) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          description: content.hero.description,
          address: content.contact.address,
          phone: content.contact.phone,
          email: content.contact.email,
          updated_at: new Date().toISOString()
        })
        .eq('section', 'hero');

      if (error) throw error;
      
      setSiteContent(content);
      toast({
        title: "Cambios guardados",
        description: "La información ha sido actualizada correctamente.",
      });
    } catch (error) {
      console.error('Error updating site content:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la información",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    blogPosts,
    testimonials,
    siteContent,
    loading,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addTestimonial,
    deleteTestimonial,
    updateSiteContent,
    refetch: fetchData
  };
};
