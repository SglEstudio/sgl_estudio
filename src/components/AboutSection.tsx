import {
  Award,
  GraduationCap,
  Building2,
  Users,
  Heart,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const teamMembers = [
    {
      name: "María Sol Andrade Despaux",
      title: "Especialista en Gestión Agroindustrial",
      // subtitle: "Ex-Presidenta CCEAU 2021-2023",
      experience: "Contadora Pública",
      image: "/sol.jpeg",
      specialties: [
        "Sector Agropecuario",
        "Reestructuración Empresarial",
        "Posgrado Industria Cárnica",
      ],
    },
    {
      name: "Lorena Falero Rodríguez",
      title: "Especialista en Gestión Administrativa",
      // subtitle: "Contabilidad Aplicada y Estrategia",
      experience: "Contadora Pública",
      image: "/lorena.jpeg",
      specialties: [
        "Comercio Automotor",
        "Empresas Forestales",
        "Proyectos COMAP",
      ],
    },
    {
      name: "Gabriela Bentancur Cardozo",
      title: "Consultora en Cooperativas",
      // subtitle: "Formuladora de Proyectos",
      experience: "Contadora Pública",
      image: "/gabriela.jpeg",
      specialties: [
        "Estructuras Cooperativas",
        "Control Interno",
        "Proyectos para Pymes",
      ],
    },
  ];

  const credentials = [
    "Más de 55 años de experiencia combinada",
    "Ex-Presidenta del CCEAU en nuestro equipo",
    "Posgrados en Universidad de Chicago y FCEA",
    "Especialización en múltiples sectores estratégicos",
    "Experiencia empresarial como emprendedoras",
  ];

  const values = [
    {
      icon: Heart,
      title: "Cercanía",
      description: "Comunicación clara y directa",
    },
    {
      icon: CheckCircle,
      title: "Honestidad",
      description: "Transparencia en diagnósticos",
    },
    {
      icon: Award,
      title: "Practicidad",
      description: "Decisiones basadas en datos",
    },
    {
      icon: Users,
      title: "Visión Integral",
      description: "Enfoque holístico del negocio",
    },
  ];

  return (
    <section id="sobre-sol" className="py-20 bg-wood-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-wood-900 mb-6">
            Nuestro Equipo
          </h2>
          <p className="text-xl text-wood-600 leading-relaxed max-w-3xl mx-auto">
            Un equipo de <strong>contadoras especializadas</strong> con
            experiencia combinada en consultoría empresarial, sector
            agropecuario y gestión financiera.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border-wood-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto shadow-md"
                    style={{ objectPosition: "center 30%" }}
                  />

                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-wood-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {member.experience}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-wood-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-wood-600 font-medium mb-1">{member.title}</p>
                <p className="text-sm text-wood-500 mb-4">{member.subtitle}</p>
                <div className="space-y-2">
                  {member.specialties.map((specialty, idx) => (
                    <div
                      key={idx}
                      className="bg-wood-100 text-wood-700 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Compromiso con la Comunidad */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-wood-800 flex items-center">
                <Heart className="h-6 w-6 mr-3 text-wood-600" />
                Compromiso con la Comunidad
              </h3>
              <p className="text-wood-600 leading-relaxed">
                Creemos que el conocimiento tiene valor cuando se comparte. Por
                eso, más allá del trabajo técnico, llevamos adelante un
                compromiso con la sociedad, ofreciendo{" "}
                <strong>charlas informativas</strong> sobre temas que
                impactan en la vida cotidiana:
              </p>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-wood-500 rounded-full"></div>
                  <span className="text-wood-700">Obligaciones fiscales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-wood-500 rounded-full"></div>
                  <span className="text-wood-700">
                    Gestión financiera personal
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-wood-500 rounded-full"></div>
                  <span className="text-wood-700">Derechos laborales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-wood-500 rounded-full"></div>
                  <span className="text-wood-700">
                    Herramientas para emprendimientos
                  </span>
                </div>
              </div>
              <p className="text-wood-600 leading-relaxed text-sm">
                A través de estas actividades, buscamos aportar a una ciudadanía
                más informada, autónoma y preparada para tomar mejores
                decisiones.
              </p>
            </div>
          </div>

          {/* Experiencia Sectorial */}
          <div className="space-y-8">
            <div className="space-y-6 bg-wood-50 p-6 rounded-xl border border-wood-200">
              <h3 className="text-2xl font-bold text-wood-800 flex items-center">
                <Award className="h-6 w-6 mr-3 text-wood-600" />
                Experiencia Sectorial
              </h3>
              <p className="text-wood-600 leading-relaxed">
                Trabajamos con una amplia gama de sectores y tipos de
                organizaciones, adaptando nuestros servicios a las necesidades
                específicas de cada cliente:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">
                    Empresas familiares
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">
                    Sector agropecuario
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">Cooperativas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">
                    Profesionales independientes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">
                    Comercios y servicios
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  <span className="text-wood-700 text-sm">
                    Emprendimientos rurales
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
