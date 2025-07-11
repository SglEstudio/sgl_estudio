// ContactSection.tsx
import { useState } from 'react';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

/** 🔸 Convierte cualquier número local a tel:+598… */
const toUruguayTelHref = (raw: string) => {
  const digits = raw.replace(/\D/g, '').replace(/^0/, '');
  return `tel:+598${digits}`;
};

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: 'Mensaje enviado',
        description: 'Nos pondremos en contacto contigo a la brevedad.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      details: [
        { label: 'Central', number: '4362 0564' },
        { label: 'Sol Andrade', number: '099 360 319' },
        { label: 'Lorena Falero', number: '098 444 270' },
        { label: 'Gabriela Bentancur', number: '098 727 527' }
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        { mail: 'sglcrmarketing@gmail.com', text: 'sglcrmarketing@gmail.com' },
        { text: 'Respuesta en 24 h' }
      ]
    },
    {
      icon: Clock,
      title: 'Horarios',
      details: [{ text: 'Lun – Vie 9 – 18 h' }, { text: 'Consultas por cita' }]
    }
  ];

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-wood-900 mb-6">
            Contáctanos
          </h2>
          <p className="text-xl text-wood-600 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte. Solicita tu consulta gratuita y descubre
            cómo podemos optimizar la gestión financiera de tu empresa.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulario de contacto */}
          <div className="lg:col-span-2">
            <Card className="border-wood-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-wood-900">
                  Solicitar Consulta Gratuita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-9">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-wood-200 focus:border-wood-500"
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-wood-200 focus:border-wood-500"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="phone"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-wood-200 focus:border-wood-500"
                    />
                    <Input
                      name="company"
                      placeholder="Empresa (opcional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="border-wood-200 focus:border-wood-500"
                    />
                  </div>

                  <Textarea
                    name="message"
                    placeholder="Cuéntanos sobre tu empresa y qué tipo de asesoramiento necesitas…"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-wood-200 focus:border-wood-500 min-h-[120px]"
                    required
                  />

                  <Button
                    type="submit"
                    className="btn-primary w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando…'
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="border-wood-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-wood-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-wood-800 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail: any, i: number) => {
                          if (detail.number) {
                            return (
                              <p key={i} className="text-wood-600 text-sm">
                                {detail.label && (
                                  <span className="mr-1 font-medium">
                                    {detail.label} –
                                  </span>
                                )}
                                <a
                                  href={toUruguayTelHref(detail.number)}
                                  className="hover:text-wood-900 underline underline-offset-2"
                                >
                                  {detail.number}
                                </a>
                              </p>
                            );
                          }
                          if (detail.mail) {
                            return (
                              <p key={i} className="text-wood-600 text-sm">
                                <a
                                  href={`mailto:${detail.mail}`}
                                  className="hover:text-wood-900 underline underline-offset-2"
                                >
                                  {detail.text}
                                </a>
                              </p>
                            );
                          }
                          return (
                            <p key={i} className="text-wood-600 text-sm">
                              {detail.text}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mapa — ancho completo */}
        <div className="mt-12">
          <Card className="border-wood-200 w-full overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.123456789!2d-56.52345678901234!3d-33.38012345678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959abc123def456%3A0x123456789abcdef0!2s25%20de%20Agosto%20879%2C%2097000%20Durazno%2C%20Uruguay!5e0!3m2!1ses!2suy!4v1634567890123"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
