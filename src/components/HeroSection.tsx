import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Calendar } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="inicio"
      className="pt-20 pb-16 lg:pt-28 lg:pb-24 gradient-wood lg:gradient-wood"
    >
      <div className="container mx-auto px-4">
        {/* MÓVIL: Layout completamente diferente */}
        <div className="lg:hidden">
          {/* Header compacto móvil */}
          <div className="text-center hidden lg:block space-y-6 mb-12">
            {/* <div className="inline-flex items-center px-3 py-1.5 bg-wood-100 rounded-full text-xs font-medium text-wood-700">
              <Star className="h-3 w-3 mr-1.5 text-wood-600" />
              Ex-Presidenta CCEAU 2021-2023
            </div> */}
            
            <h1 className="text-3xl font-bold text-wood-900 leading-tight">
              Asesoría 
              <span className="text-gradient block"> Contable Integral</span>
            </h1>
          </div>

          {/* Imagen como hero en móvil */}
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl mx-4">
            <img
              src="/portada.png"
              alt="Profesionales trabajando en consultoría empresarial"
              className="w-full h-[280px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-900/60 via-transparent to-transparent"></div>
            
            {/* Badge flotante sobre la imagen */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-wood-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-wood-600" />
                  </div>
                  <div>
                  <p className="font-semibold block lg:hidden text-wood-900 text-lg">Asesoría</p>
                    <p className="text-md block lg:hidden text-wood-600"> Contable Integral</p>
                    <p className="font-semibold hidden lg:block text-wood-900 text-sm">Sol Andrade</p>
                    <p className="text-xs hidden lg:block  text-wood-600">Contadora Pública</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido debajo de la imagen */}
          <div className="space-y-6 text-center">
            <p className="text-lg text-wood-700 leading-relaxed px-2">
              Más de 30 años trabajando con{" "}
              <strong>empresas familiares, emprendimientos rurales y profesionales independientes.</strong>
            </p>

            {/* Stats en móvil - más compactos */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <Calendar className="h-6 w-6 text-wood-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-wood-700 block">30+ años</span>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 text-wood-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-wood-700 block">Familias</span>
              </div>
              <div className="text-center">
                <Star className="h-6 w-6 text-wood-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-wood-700 block">Agro</span>
              </div>
            </div>

            {/* CTAs en móvil */}
            <div className="space-y-3 px-4">
              <Button
                onClick={() => scrollToSection("contacto")}
                className="btn-primary group w-full"
                size="lg"
              >
                Solicitar Consulta
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("servicios")}
                variant="outline"
                size="lg"
                className="border-wood-300 text-wood-700 hover:bg-wood-50 w-full"
              >
                Ver Servicios
              </Button>
            </div>
          </div>
        </div>

        {/* DESKTOP: Layout original */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 space-y-8 animate-fade-in">
            {/* Badge */}
            {/* <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-wood-700 shadow-sm">
              <Star className="h-4 w-4 mr-2 text-wood-600" />
              Ex-Presidenta CCEAU 2021-2023
            </div> */}

            {/* Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-wood-900 leading-tight">
                Asesoría 
                <span style={{lineHeight: "1.5"}} className="text-gradient block"> Contable Integral</span>
              </h1>
              <p className="text-xl lg:text-2xl text-wood-700 leading-relaxed">
                Más de 30 años trabajando con{" "}
                <strong>
                  empresas familiares,
                  emprendimientos rurales, comercios y profesionales independientes.
                </strong>
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-wood-600 leading-relaxed max-w-xl">
              Equipo de contadoras con una mirada amplia, práctica y
              comprometida con la realidad de quienes confían en nuestro
              trabajo. En Estudio SGL entendemos la contabilidad no como un fin
              en sí mismo, sino como una herramienta estratégica para ordenar,
              proyectar y decidir mejor.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-wood-600" />
                <span className="text-wood-700 font-semibold">30+ años</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-wood-600" />
                <span className="text-wood-700 font-semibold">
                  Empresas familiares
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-wood-600" />
                <span className="text-wood-700 font-semibold">
                  Sector agropecuario
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection("contacto")}
                className="btn-primary group"
                size="lg"
              >
                Solicitar Consulta
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("servicios")}
                variant="outline"
                size="lg"
                className="border-wood-300 text-wood-700 hover:bg-wood-50"
              >
                Ver Servicios
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-4xl">
              <img
                src="/portada.png"
                alt="Profesionales trabajando en consultoría empresarial"
                className="w-full h-[500px] lg:h-[600px] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-900/20 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-8 h-24 rounded-xl shadow-lg max-w-xs">
              <div className="flex items-center mt-[-10px]">
                <img className="w-48" src="/Recurso 1-8.png" alt="" />
                {/* <div className="w-12 h-12 bg-wood-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-wood-600" />
                </div>
                <div>
                  <p className="font-semibold text-wood-900">Sol Andrade</p>
                  <p className="text-sm text-wood-600">Contadora Pública</p>
                  <p className="text-xs text-wood-500">
                    Presidenta Comisión de Agro CCEAU
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;