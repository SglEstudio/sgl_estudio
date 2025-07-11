
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Save } from 'lucide-react';
import { SiteContent } from '@/hooks/useAdminData';

interface ContentTabProps {
  siteData: SiteContent;
  setSiteData: (data: SiteContent) => void;
}

const ContentTab = ({ siteData, setSiteData }: ContentTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(siteData);

  const handleSave = () => {
    setSiteData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(siteData);
    setIsEditing(false);
  };

  return (
    <Card className="border-wood-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-wood-900">Contenido del Sitio</CardTitle>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="border-wood-300">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-wood-300">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Section */}
        <div>
          <h3 className="text-lg font-semibold text-wood-900 mb-4">Sección Principal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Título</label>
              <Input
                value={isEditing ? editedData.hero.title : siteData.hero.title}
                onChange={(e) => setEditedData({
                  ...editedData,
                  hero: { ...editedData.hero, title: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Subtítulo</label>
              <Input
                value={isEditing ? editedData.hero.subtitle : siteData.hero.subtitle}
                onChange={(e) => setEditedData({
                  ...editedData,
                  hero: { ...editedData.hero, subtitle: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Descripción</label>
              <Textarea
                value={isEditing ? editedData.hero.description : siteData.hero.description}
                onChange={(e) => setEditedData({
                  ...editedData,
                  hero: { ...editedData.hero, description: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-wood-900 mb-4">Información de Contacto</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Dirección</label>
              <Input
                value={isEditing ? editedData.contact.address : siteData.contact.address}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact, address: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Teléfono</label>
              <Input
                value={isEditing ? editedData.contact.phone : siteData.contact.phone}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact, phone: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-700 mb-2">Email</label>
              <Input
                value={isEditing ? editedData.contact.email : siteData.contact.email}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact, email: e.target.value }
                })}
                disabled={!isEditing}
                className="border-wood-200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTab;
