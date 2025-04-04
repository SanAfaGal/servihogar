import React from 'react';
import { Wrench, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: 'Plomería',
    description: 'Reparación y mantenimiento de tuberías, grifos, desagües y más.',
    icon: '🔧'
  },
  {
    title: 'Electricidad',
    description: 'Instalaciones, reparaciones y mantenimiento eléctrico.',
    icon: '⚡'
  },
  {
    title: 'Carpintería',
    description: 'Reparación y fabricación de muebles, puertas y estructuras de madera.',
    icon: '🪚'
  },
  {
    title: 'Pintura',
    description: 'Servicios de pintura interior y exterior para tu hogar.',
    icon: '🎨'
  },
  {
    title: 'Limpieza',
    description: 'Limpieza profunda y mantenimiento de hogares y oficinas.',
    icon: '🧹'
  },
  {
    title: 'Jardinería',
    description: 'Mantenimiento y diseño de jardines, poda y paisajismo.',
    icon: '🌿'
  },
  {
    title: 'Cerrajería',
    description: 'Instalación y reparación de cerraduras, llaves y sistemas de seguridad.',
    icon: '🔑'
  },
  {
    title: 'Aire Acondicionado',
    description: 'Instalación, reparación y mantenimiento de sistemas de climatización.',
    icon: '❄️'
  }
];

export default function Services() {
  const navigate = useNavigate();

  const handleAuth = (isSignUp: boolean) => {
    navigate('/auth', { state: { isSignUp } });
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra profesionales calificados para cualquier necesidad de tu hogar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-8">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <button
                  onClick={() => handleAuth(true)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Solicitar servicio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-8 bg-blue-600 rounded-2xl">
            <div className="text-white mr-8">
              <h2 className="text-2xl font-bold mb-2">
                ¿Eres un profesional?
              </h2>
              <p className="text-blue-100">
                Únete a nuestra red de expertos y comienza a ofrecer tus servicios
              </p>
            </div>
            <button
              onClick={() => handleAuth(true)}
              className="inline-flex items-center px-6 py-3 bg-white rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
            >
              Registrarse como profesional
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}