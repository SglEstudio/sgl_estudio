import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, Edit, Upload, X, Image, Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
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

// Componente de editor de imagen simple
const ImageEditor = ({ 
  imageFile, 
  onSave, 
  onCancel 
}: { 
  imageFile: File; 
  onSave: (editedImage: File) => void; 
  onCancel: () => void; 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 300, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Cargar imagen
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageSrc(result);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Dibujar imagen en canvas
  const drawImageOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas size
    canvas.width = 500;
    canvas.height = 400;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular dimensiones de la imagen
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    let drawWidth = canvas.width * scale;
    let drawHeight = canvas.height * scale;

    if (aspectRatio > 1) {
      drawHeight = drawWidth / aspectRatio;
    } else {
      drawWidth = drawHeight * aspectRatio;
    }

    // Posición centrada
    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;

    // Aplicar transformaciones
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Dibujar imagen
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    ctx.restore();

    // Dibujar área de recorte
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Dibujar overlay semitransparente fuera del área de recorte
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, cropArea.y);
    ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height);
    ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvas.width - cropArea.x - cropArea.width, cropArea.height);
    ctx.fillRect(0, cropArea.y + cropArea.height, canvas.width, canvas.height - cropArea.y - cropArea.height);

  }, [scale, rotation, imageLoaded, cropArea]);

  // Redibujar cuando cambien los parámetros
  useEffect(() => {
    if (imageLoaded) {
      drawImageOnCanvas();
    }
  }, [drawImageOnCanvas, imageLoaded]);

  // Manejar carga de imagen
  const handleImageLoad = () => {
    setImageLoaded(true);
    drawImageOnCanvas();
  };

  // Eventos del mouse para el área de recorte
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCropArea = {
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y)
    };

    setCropArea(newCropArea);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Aplicar recorte y guardar
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Crear un nuevo canvas para el resultado final
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return;

    // Si hay área de recorte, usar esas dimensiones
    if (cropArea.width > 10 && cropArea.height > 10) {
      outputCanvas.width = cropArea.width;
      outputCanvas.height = cropArea.height;
      
      // Copiar solo el área recortada
      outputCtx.drawImage(
        canvas,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
    } else {
      // Si no hay recorte, usar toda la imagen
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      outputCtx.drawImage(canvas, 0, 0);
    }

    // Convertir a blob y crear archivo
    outputCanvas.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], imageFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        onSave(editedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Editor de Imagen</h3>
        
        {/* Imagen oculta para cargar */}
        <img
          ref={imageRef}
          src={imageSrc}
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
          alt="Source"
        />
        
        {/* Canvas de edición */}
        <div className="border border-wood-200 rounded-lg p-4 bg-gray-50 flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 cursor-crosshair max-w-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {/* Controles de edición */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.3, scale - 0.1))}
              disabled={!imageLoaded}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[60px]">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(2, scale + 0.1))}
              disabled={!imageLoaded}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation((rotation + 90) % 360)}
            disabled={!imageLoaded}
            className="bg-white"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            {rotation}°
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setScale(1);
              setRotation(0);
              setCropArea({ x: 50, y: 50, width: 300, height: 200 });
            }}
            disabled={!imageLoaded}
            className="bg-white"
          >
            Restablecer
          </Button>
        </div>

        {/* Instrucciones */}
        <div className="text-sm text-wood-600 mt-3 bg-wood-50 p-3 rounded-lg">
          <p>📏 <strong>Zoom:</strong> Ajusta el tamaño con los botones + y -</p>
          <p>🔄 <strong>Rotar:</strong> Usa el botón de rotación</p>
          <p>✂️ <strong>Recortar:</strong> Haz clic y arrastra para seleccionar área</p>
          <p>🔄 <strong>Restablecer:</strong> Vuelve a la imagen original</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="outline" onClick={onCancel} size="lg">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="btn-primary" 
            disabled={!imageLoaded}
            size="lg"
          >
            <Crop className="h-4 w-4 mr-2" />
            Aplicar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

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

  // Estados para editor de imagen
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [isEditingNewPost, setIsEditingNewPost] = useState(true);

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
      await createBucketIfNotExists();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen: ' + error.message);
        return null;
      }

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

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    // Abrir editor de imagen
    setEditingImageFile(file);
    setIsEditingNewPost(true);
    setShowImageEditor(true);
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

    setEditingImageFile(file);
    setIsEditingNewPost(false);
    setShowImageEditor(true);
  };

  // Guardar imagen editada
  const handleSaveEditedImage = async (editedFile: File) => {
    setShowImageEditor(false);
    
    if (isEditingNewPost) {
      setUploadingImage(true);
    } else {
      setUploadingEditImage(true);
    }

    // Preview de la imagen editada
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isEditingNewPost) {
        setPreviewImage(e.target?.result as string);
      } else {
        setEditPreviewImage(e.target?.result as string);
      }
    };
    reader.readAsDataURL(editedFile);

    // Subir a Supabase
    const imageUrl = await uploadImageToSupabase(editedFile);
    
    if (imageUrl) {
      if (isEditingNewPost) {
        setNewBlogPost({
          ...newBlogPost,
          image_url: imageUrl
        });
      } else if (editingPost) {
        setEditingPost({
          ...editingPost,
          image_url: imageUrl
        });
      }
    }

    if (isEditingNewPost) {
      setUploadingImage(false);
    } else {
      setUploadingEditImage(false);
    }
    
    setEditingImageFile(null);
  };

  // Cancelar edición de imagen
  const handleCancelImageEdit = () => {
    setShowImageEditor(false);
    setEditingImageFile(null);
  };

  // Resto de funciones sin cambios...
  const clearNewImage = () => {
    setPreviewImage(null);
    setNewBlogPost({
      ...newBlogPost,
      image_url: ''
    });
  };

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
    <>
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
              
              <div className="text-xs text-wood-500">
                ✨ Podrás editar y ajustar la imagen antes de subirla
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
                    ✨ Podrás editar y ajustar la imagen antes de subirla
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

      {/* Editor de Imagen Modal */}
      <Dialog open={showImageEditor} onOpenChange={() => {}}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Imagen</DialogTitle>
          </DialogHeader>
          {editingImageFile && (
            <ImageEditor
              imageFile={editingImageFile}
              onSave={handleSaveEditedImage}
              onCancel={handleCancelImageEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogTab;