import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Building,
  User,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const MessagesTab = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Función para obtener mensajes de contacto
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar mensaje como leído
  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      // Actualizar estado local
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Función para marcar como respondido
  const markAsReplied = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'replied', updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'replied' } : msg
        )
      );
    } catch (err) {
      console.error('Error marking as replied:', err);
    }
  };

  // Función para eliminar mensaje
  const deleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Actualizar estado local
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Cerrar modal si estaba abierto
      if (selectedMessage?.id === messageId) {
        setIsDialogOpen(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Función para abrir modal con mensaje completo
  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    
    // Marcar como leído si no lo está
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Configurar actualización automática cada 30 segundos
    const interval = setInterval(fetchMessages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'replied':
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };


  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="border-wood-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Estados de error y vacío
  if (loading) {
    return (
      <Card className="border-wood-200">
        <CardHeader>
          <CardTitle className="text-wood-900">Mensajes Recibidos</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-wood-200">
        <CardHeader>
          <CardTitle className="text-wood-900">Mensajes Recibidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchMessages} variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="border-wood-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-wood-900">Mensajes Recibidos</CardTitle>
            <Button onClick={fetchMessages} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-wood-600">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay mensajes nuevos</p>
            <p className="text-sm text-wood-500 mt-2">
              Los mensajes del formulario de contacto aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  const todayCount = messages.filter(msg => {
    const today = new Date().toDateString();
    const messageDate = new Date(msg.created_at).toDateString();
    return today === messageDate;
  }).length;

  return (
    <>
      <Card className="border-wood-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-wood-900">
                Mensajes Recibidos
              </CardTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {unreadCount} nuevos
                  </Badge>
                )}
                {todayCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {todayCount} hoy
                  </Badge>
                )}
              </div>
            </div>
            <Button onClick={fetchMessages} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  message.status === 'unread' 
                    ? 'border-orange-200 bg-orange-50/30 shadow-sm' 
                    : 'border-wood-200 hover:border-wood-300'
                }`}
                onClick={() => openMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header del mensaje */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-wood-600" />
                          <span className="font-semibold text-wood-900 truncate">
                            {message.name}
                          </span>
                        </div>
                      </div>

                      {/* Email y teléfono */}
                      <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-wood-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{message.email}</span>
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                        {message.company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span className="truncate">{message.company}</span>
                          </div>
                        )}
                      </div>

                      {/* Mensaje (truncado) */}
                      <p className="text-wood-700 text-sm line-clamp-2 mb-2">
                        {message.message}
                      </p>

                      {/* Fecha */}
                      <div className="flex items-center gap-1 text-xs text-wood-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>

                    {/* Menú de acciones */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            openMessage(message);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver completo
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estadísticas */}
          <div className="mt-4 pt-4 border-t border-wood-200">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="font-semibold text-wood-900">{messages.length}</span>
                <p className="text-wood-600">Total</p>
              </div>
              <div>
                <span className="font-semibold text-orange-600">{unreadCount}</span>
                <p className="text-wood-600">No leídos</p>
              </div>
              <div>
                <span className="font-semibold text-blue-600">{todayCount}</span>
                <p className="text-wood-600">Hoy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver mensaje completo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mensaje de contacto</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Información del contacto */}
              <div className="bg-wood-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-wood-600">Nombre</label>
                    <p className="text-wood-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-wood-600">Email</label>
                    <p className="text-wood-900">
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="text-sm font-medium text-wood-600">Teléfono</label>
                      <p className="text-wood-900">
                        <a 
                          href={`tel:+598${selectedMessage.phone.replace(/\D/g, '')}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedMessage.company && (
                    <div>
                      <label className="text-sm font-medium text-wood-600">Empresa</label>
                      <p className="text-wood-900">{selectedMessage.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="text-sm font-medium text-wood-600">Mensaje</label>
                <div className="mt-2 p-4 bg-white border border-wood-200 rounded-lg">
                  <p className="text-wood-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Metadatos */}
              <div className="flex items-center justify-between text-sm text-wood-500 pt-4 border-t border-wood-200">
                <div>
                  <span>Recibido el {formatDate(selectedMessage.created_at)}</span>
                </div>
                <div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cerrar
                </Button>
                {selectedMessage.status !== 'replied' && (
                  <Button
                    onClick={() => {
                      markAsReplied(selectedMessage.id);
                      setIsDialogOpen(false);
                    }}
                    className="btn-primary"
                  >
                    Marcar como respondido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessagesTab;