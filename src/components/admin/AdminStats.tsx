
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, FileText, BarChart3, Settings } from 'lucide-react';

interface AdminStatsProps {
  testimonialsCount: number;
  blogPostsCount: number;
}

const AdminStats = ({ testimonialsCount, blogPostsCount }: AdminStatsProps) => {
  return (
    <div className="grid md:grid-cols-5 gap-6 mb-8">
      <Card className="border-wood-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-wood-600 text-sm">Mensajes</p>
              <p className="text-2xl font-bold text-wood-900">12</p>
            </div>
            <MessageSquare className="h-8 w-8 text-wood-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-wood-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-wood-600 text-sm">Testimonios</p>
              <p className="text-2xl font-bold text-wood-900">{testimonialsCount}</p>
            </div>
            <Users className="h-8 w-8 text-wood-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-wood-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-wood-600 text-sm">Artículos</p>
              <p className="text-2xl font-bold text-wood-900">{blogPostsCount}</p>
            </div>
            <FileText className="h-8 w-8 text-wood-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-wood-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-wood-600 text-sm">Visitas</p>
              <p className="text-2xl font-bold text-wood-900">1,247</p>
            </div>
            <BarChart3 className="h-8 w-8 text-wood-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-wood-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-wood-600 text-sm">Servicios</p>
              <p className="text-2xl font-bold text-wood-900">8</p>
            </div>
            <Settings className="h-8 w-8 text-wood-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
