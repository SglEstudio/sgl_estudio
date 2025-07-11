import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import ContentTab from '@/components/admin/ContentTab';
import BlogTab from '@/components/admin/BlogTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import MessagesTab from '@/components/admin/MessagesTab';
import SettingsTab from '@/components/admin/SettingsTab';
import { useAdminData } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    blogPosts,
    testimonials,
    siteContent,
    loading,
    addBlogPost,
    deleteBlogPost,
    addTestimonial,
    deleteTestimonial,
    updateSiteContent,
    updateBlogPost
  } = useAdminData();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wood-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wood-50">
      <AdminHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AdminStats 
          testimonialsCount={testimonials.length}
          blogPostsCount={blogPosts.length}
        />

        {/* Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-white border border-wood-200">
            <TabsTrigger value="content" className="data-[state=active]:bg-wood-100">
              Contenido
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-wood-100">
              Blog
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-wood-100">
              Testimonios
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-wood-100">
              Mensajes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-wood-100">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentTab 
              siteData={siteContent} 
              setSiteData={updateSiteContent} 
            />
          </TabsContent>

          <TabsContent value="blog">
            <BlogTab 
              blogPosts={blogPosts} 
              onAddPost={addBlogPost}
              onUpdatePost={updateBlogPost}
              onDeletePost={deleteBlogPost}
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab 
              testimonials={testimonials} 
              onAddTestimonial={addTestimonial}
              onDeleteTestimonial={deleteTestimonial}
            />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
