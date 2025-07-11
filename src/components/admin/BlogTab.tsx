
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, Edit } from 'lucide-react';
import { BlogPost } from '@/hooks/useAdminData';
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
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({
      ...post,
      date: new Date(post.date).toISOString().split('T')[0]
    });
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
          <Input
            placeholder="URL de la imagen"
            value={newBlogPost.image_url}
            onChange={(e) => setNewBlogPost({
              ...newBlogPost,
              image_url: e.target.value
            })}
            className="border-wood-200"
          />
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
          <Button onClick={handleAddPost} className="btn-primary w-full">
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
              <Input
                placeholder="URL de la imagen"
                value={editingPost.image_url}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  image_url: e.target.value
                })}
                className="border-wood-200"
              />
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
                <Button onClick={handleUpdatePost} className="btn-primary">
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
