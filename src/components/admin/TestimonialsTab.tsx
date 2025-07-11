
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { Testimonial } from '@/hooks/useAdminData';

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  onDeleteTestimonial: (id: string) => void;
}

const TestimonialsTab = ({ testimonials, onAddTestimonial, onDeleteTestimonial }: TestimonialsTabProps) => {
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5
  });

  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.content) {
      onAddTestimonial(newTestimonial);
      setNewTestimonial({ name: '', company: '', content: '', rating: 5 });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-wood-200">
        <CardHeader>
          <CardTitle className="text-wood-900">Agregar Testimonio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nombre completo"
            value={newTestimonial.name}
            onChange={(e) => setNewTestimonial({
              ...newTestimonial,
              name: e.target.value
            })}
            className="border-wood-200"
          />
          <Input
            placeholder="Empresa"
            value={newTestimonial.company}
            onChange={(e) => setNewTestimonial({
              ...newTestimonial,
              company: e.target.value
            })}
            className="border-wood-200"
          />
          <Textarea
            placeholder="Testimonio"
            value={newTestimonial.content}
            onChange={(e) => setNewTestimonial({
              ...newTestimonial,
              content: e.target.value
            })}
            className="border-wood-200"
          />
          <Button onClick={handleAddTestimonial} className="btn-primary w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Testimonio
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-wood-900">Testimonios Existentes</h3>
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-wood-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-wood-900">{testimonial.name}</p>
                  <p className="text-sm text-wood-600">{testimonial.company}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteTestimonial(testimonial.id)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-wood-700 text-sm">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsTab;
