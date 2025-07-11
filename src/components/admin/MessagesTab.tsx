
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const MessagesTab = () => {
  return (
    <Card className="border-wood-200">
      <CardHeader>
        <CardTitle className="text-wood-900">Mensajes Recibidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-wood-600">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay mensajes nuevos</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesTab;
