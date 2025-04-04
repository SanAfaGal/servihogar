import React from 'react';
import { ArrowRight, CheckCircle, Wrench, Clock, Shield, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleAuth = (isSignUp: boolean) => {
    navigate('/auth', { state: { isSignUp } });
  };

  const features = [
    {
      icon: <Wrench className="h-6 w-6 text-blue-500" />,
      title: 'Servicios Profesionales',
      description: 'Expertos calificados para todo tipo de servicios domésticos'
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: 'Disponibilidad 24/7',
      description: 'Atención a emergencias y servicios programados en todo momento'
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: 'Garantía de Servicio',
      description: 'Todos nuestros trabajos están garantizados'
    },
    {
      icon: <Star className="h-6 w-6 text-blue-500" />,
      title: 'Calidad Asegurada',
      description: 'Profesionales verificados y evaluados por la comunidad'
    }
  ];

  const services = [
    'Plomería',
    'Electricidad',
    'Carpintería',
    'Pintura',
    'Limpieza',
    'Jardinería',
    'Cerrajería',
    'Aire Acondicionado'
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Servicios para el Hogar de Calidad
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Conectamos a profesionales calificados con personas que necesitan servicios domésticos confiables
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleAuth(true)}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                Empezar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos la mejor experiencia en servicios domésticos con profesionales verificados y un servicio al cliente excepcional
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cubrimos todas tus necesidades con profesionales especializados en cada área
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-900 font-medium">{service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y encuentra el profesional perfecto para tus necesidades
          </p>
          <button
            onClick={() => handleAuth(true)}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Registrarse ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}