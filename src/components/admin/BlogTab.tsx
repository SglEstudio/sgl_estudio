import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, Edit, Upload, X, Image } from 'lucide-react';
import { BlogPost } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BlogTabProps {
  blogPosts: BlogPost[];
  onAddPost: (post: Omit<BlogPost, 'id'>) => void;
  onDeletePost: (id: string) => void;
  onUpdatePost: (id: string, post: Omit<BlogPost, 'id'>) => void;
}

const BlogTab = ({ blogPosts, onAddPost, onDeletePost, onUpdatePost }: BlogTabProps) => {
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    image_url: ''
  });

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Estados para file upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);

  // Función para crear bucket si no existe
  const createBucketIfNotExists = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const publicBucket = buckets?.find(bucket => bucket.name === 'public');
      
      if (!publicBucket) {
        const { error } = await supabase.storage.createBucket('public', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/*']
        });
        
        if (error) {
          console.error('Error creating bucket:', error);
        } else {
          console.log('Bucket "public" created successfully');
        }
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
    }
  };

  // Función para subir imagen a Supabase Storage
  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      // Asegurar que existe el bucket
      await createBucketIfNotExists();
      
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen: ' + error.message);
        return null;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al subir la imagen');
      return null;
    }
  };

  // Handle file upload para nuevo post
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setUploadingImage(true);
    
    // Preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Supabase
    const imageUrl = await uploadImageToSupabase(file);
    if (imageUrl) {
      setNewBlogPost({
        ...newBlogPost,
        image_url: imageUrl
      });
    }

    setUploadingImage(false);
  };

  // Handle file upload para editar post
  const handleEditFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingPost) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setUploadingEditImage(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    const imageUrl = await uploadImageToSupabase(file);
    if (imageUrl) {
      setEditingPost({
        ...editingPost,
        image_url: imageUrl
      });
    }

    setUploadingEditImage(false);
  };

  // Limpiar preview de imagen nueva
  const clearNewImage = () => {
    setPreviewImage(null);
    setNewBlogPost({
      ...newBlogPost,
      image_url: ''
    });
  };

  // Limpiar preview de imagen editada
  const clearEditImage = () => {
    setEditPreviewImage(null);
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        image_url: ''
      });
    }
  };

  const handleAddPost = () => {
    if (newBlogPost.title && newBlogPost.excerpt && newBlogPost.content) {
      onAddPost(newBlogPost);
      setNewBlogPost({
        title: '',
        excerpt: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        image_url: ''
      });
      setPreviewImage(null);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({
      ...post,
      date: new Date(post.date).toISOString().split('T')[0]
    });
    setEditPreviewImage(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = () => {
    if (editingPost && editingPost.title && editingPost.excerpt && editingPost.content) {
      onUpdatePost(editingPost.id, {
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        date: editingPost.date,
        category: editingPost.category,
        image_url: editingPost.image_url
      });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      setEditPreviewImage(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Add New Blog Post */}
      <Card className="border-wood-200">
        <CardHeader>
          <CardTitle className="text-wood-900">Agregar Artículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título del artículo"
            value={newBlogPost.title}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              title: e.target.value
            })}
            className="border-wood-200"
          />
          <Input
            placeholder="Categoría"
            value={newBlogPost.category}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              category: e.target.value
            })}
            className="border-wood-200"
          />
          <Input
            type="date"
            value={newBlogPost.date}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              date: e.target.value
            })}
            className="border-wood-200"
          />
          
          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-wood-700">Imagen del artículo</label>
            
            {/* Preview de imagen existente o cargada */}
            {(previewImage || newBlogPost.image_url) && (
              <div className="relative">
                <img 
                  src={previewImage || newBlogPost.image_url} 
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-wood-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearNewImage}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Input de archivo */}
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="border-wood-200"
              />
              {uploadingImage && (
                <div className="flex items-center gap-2 text-wood-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wood-600"></div>
                  <span className="text-sm">Subiendo...</span>
                </div>
              )}
            </div>
          </div>

          <Textarea
            placeholder="Resumen del artículo"
            value={newBlogPost.excerpt}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              excerpt: e.target.value
            })}
            className="border-wood-200"
          />
          <Textarea
            placeholder="Contenido completo del artículo"
            value={newBlogPost.content}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              content: e.target.value
            })}
            className="border-wood-200 min-h-[120px]"
          />
          <Button 
            onClick={handleAddPost} 
            className="btn-primary w-full"
            disabled={uploadingImage}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Artículo
          </Button>
        </CardContent>
      </Card>

      {/* Existing Blog Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-wood-900">Artículos Existentes</h3>
        <div className="max-h-[600px] overflow-y-auto space-y-4">
          {blogPosts.map((post) => (
            <Card key={post.id} className="border-wood-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-wood-600 bg-wood-100 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <div className="flex items-center text-wood-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('es-UY')}
                      </div>
                    </div>
                    <p className="font-semibold text-wood-900 text-sm mb-1">{post.title}</p>
                    <p className="text-wood-700 text-xs line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="border-wood-300 text-wood-700 hover:bg-wood-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeletePost(post.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {post.image_url && (
                  <div className="mt-2">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Artículo</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <Input
                placeholder="Título del artículo"
                value={editingPost.title}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  title: e.target.value
                })}
                className="border-wood-200"
              />
              <Input
                placeholder="Categoría"
                value={editingPost.category}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  category: e.target.value
                })}
                className="border-wood-200"
              />
              <Input
                type="date"
                value={editingPost.date}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  date: e.target.value
                })}
                className="border-wood-200"
              />
              
              {/* File Upload Section para editar */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-wood-700">Imagen del artículo</label>
                
                {((editPreviewImage || editingPost.image_url) && (editPreviewImage || editingPost.image_url)) && (
                  <div className="relative">
                    <img 
                      src={editPreviewImage || editingPost.image_url} 
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-wood-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearEditImage}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileUpload}
                    disabled={uploadingEditImage}
                    className="border-wood-200"
                  />
                  {uploadingEditImage && (
                    <div className="flex items-center gap-2 text-wood-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wood-600"></div>
                      <span className="text-sm">Subiendo...</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-wood-500">
                  O ingresa una URL manualmente:
                </div>
                <Input
                  placeholder="URL de la imagen (opcional)"
                  value={editingPost.image_url}
                  onChange={(e) => {
                    setEditingPost({
                      ...editingPost,
                      image_url: e.target.value
                    });
                    setEditPreviewImage(null);
                  }}
                  className="border-wood-200"
                />
              </div>

              <Textarea
                placeholder="Resumen del artículo"
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  excerpt: e.target.value
                })}
                className="border-wood-200"
              />
              <Textarea
                placeholder="Contenido completo del artículo"
                value={editingPost.content}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  content: e.target.value
                })}
                className="border-wood-200 min-h-[120px]"
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdatePost} 
                  className="btn-primary"
                  disabled={uploadingEditImage}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogTab;