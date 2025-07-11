
import { 
  Calculator, 
  TrendingUp, 
  Wheat, 
  FileText, 
  Target, 
  Users, 
  Building, 
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      icon: Calculator,
      title: "Gestión Contable Integral",
      description: "Contabilidad completa, liquidaciones fiscales y cumplimiento normativo para empresas de todos los tamaños.",
      features: ["Registros contables", "Estados financieros", "Declaraciones fiscales"]
    },
    {
      icon: Wheat,
      title: "Consultoría Agropecuaria",
      description: "Especialización en sector rural con análisis de costos, rentabilidad y gestión de empresas agropecuarias.",
      features: ["Análisis de costos rurales", "Planificación de siembras", "Gestión de riesgos"]
    },
    {
      icon: TrendingUp,
      title: "Planificación Financiera",
      description: "Estrategias financieras personalizadas para pymes y empresas familiares con visión a largo plazo.",
      features: ["Flujo de caja", "Presupuestos", "Análisis de inversiones"]
    },
    {
      icon: Target,
      title: "Análisis de Rentabilidad",
      description: "Evaluación detallada de márgenes, costos y oportunidades de mejora en la rentabilidad empresarial.",
      features: ["Análisis de márgenes", "Control de costos", "Optimización financiera"]
    },
    {
      icon: FileText,
      title: "Diagnóstico Empresarial",
      description: "Evaluación integral del estado financiero y operativo de la empresa con recomendaciones estratégicas.",
      features: ["Auditoría interna", "Análisis FODA", "Plan de mejoras"]
    },
    {
      icon: Users,
      title: "Sucesiones y Reorganización",
      description: "Asesoramiento en procesos sucesorios y reorganización patrimonial para empresas familiares.",
      features: ["Planificación sucesoria", "Protocolo familiar", "Estructura societaria"]
    },
    {
      icon: Building,
      title: "Profesionalización Empresarial",
      description: "Acompañamiento en procesos de crecimiento y profesionalización de empresas familiares.",
      features: ["Gobierno corporativo", "Procesos y controles", "Capacitación"]
    },
    {
      icon: Globe,
      title: "Comercio Exterior",
      description: "Consultoría en operaciones de importación, exportación y trámites aduaneros.",
      features: ["Trámites aduaneros", "Documentación", "Régimen tributario"]
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-wood-900 mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-wood-600 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos una gama completa de servicios contables.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-wood-100 hover:border-wood-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-wood-200 transition-colors">
                  <service.icon className="h-6 w-6 text-wood-600" />
                </div>
                <CardTitle className="text-lg text-wood-900 group-hover:text-wood-700 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-wood-600 mb-4 leading-relaxed">
                  {service.description}
                </CardDescription>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 text-sm text-wood-500">
                      <div className="w-1.5 h-1.5 bg-wood-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
