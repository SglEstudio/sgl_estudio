
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const SettingsTab = () => {
  return (
    <Card className="border-wood-200">
      <CardHeader>
        <CardTitle className="text-wood-900">Configuración del Sitio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-wood-600">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Configuraciones adicionales próximamente</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
