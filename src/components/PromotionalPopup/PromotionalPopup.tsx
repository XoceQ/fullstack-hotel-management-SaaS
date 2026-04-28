'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaWhatsapp, FaRocket, FaStar, FaCheckCircle, FaClock, FaUsers, FaShieldAlt } from 'react-icons/fa';

type PlanType = 'basic' | 'pro';

interface PlanInfo {
  serviceName: string;
  commercialName: string;
  description: string;
  specialConditions: {
    schedule: string;
    duration: string;
  };
  includedActivities: string[];
  guarantee: string;
  usageConditions: string;
  minProduction: string;
  maxProduction: string;
  other: string;
  badge: string;
  badgeColor: string;
}

const marketingTips = [
  '💡 78% de hoteles que usan gestión digital aumentan sus reservas en el primer mes',
  '💡 Automatiza el 90% de tareas repetitivas y enfócate en tus huéspedes',
  '💡 Hoteles con reserva online reciben 3x más clientes directos',
  '💡 La respuesta rápida aumenta la satisfacción en un 65%',
];

const plans: Record<PlanType, PlanInfo> = {
  basic: {
    serviceName: 'Basic Plan',
    commercialName: 'GG Hotel Manager - Basic Plan',
    description: 'Servicio basado en la nube que permite a hoteles pequeños y medianos gestionar sus operaciones diarias de manera eficiente y segura. Incluye reservas, habitaciones, clientes y pagos, todo administrable desde cualquier navegador. Se ofrece como suscripción mensual, con soporte técnico incluido, actualizaciones constantes y posibilidad de personalización bajo demanda.',
    specialConditions: {
      schedule: 'Acceso 24/7 desde cualquier navegador web.',
      duration: 'Servicio activo mientras la suscripción esté vigente, con renovación automática mensual.'
    },
    includedActivities: [
      'Gestión de reservas y habitaciones',
      'Registro y administración de clientes',
      'Panel de administración con estadísticas y reportes',
      'Gestión de pagos y facturación',
      'Automatización de tareas rutinarias y optimización dinámica de precios y ocupación'
    ],
    guarantee: 'Soporte técnico continuo, corrección de errores y actualizaciones incluidas en la suscripción.',
    usageConditions: 'Requiere conexión a internet y acceso mediante credenciales autorizadas. Prohibido el uso indebido o reventa del acceso.',
    minProduction: '1 cliente activo',
    maxProduction: 'Escalable según demanda y capacidad de infraestructura.',
    other: 'NA',
    badge: 'Ideal para Empezar',
    badgeColor: 'bg-blue-500'
  },
  pro: {
    serviceName: 'Pro plan',
    commercialName: 'GG Hotel Manager - Pro plan',
    description: 'Módulos avanzados (asistencia técnica especializada, capacitación certificada, integración con facturación electrónica o pasarelas de pago) se ofrecen con tarifa adicional.',
    specialConditions: {
      schedule: 'Lunes a viernes, 8:00 a.m. – 8:00 p.m., con respuesta rápida y directa para resolver dudas o errores sin visitas presenciales.',
      duration: 'Activo mientras la suscripción pro esté vigente.'
    },
    includedActivities: [
      'Asistencia en la configuración del codigo fuente y uso del sistema GG Hotel Manager',
      'Resolución de errores técnicos y dudas operativas',
      'Orientación sobre buenas prácticas de gestión hotelera',
      'Recomendaciones y soporte sobre nuevas funcionalidades del sistema'
    ],
    guarantee: 'Respuesta rápida durante el horario de soporte. Corrección de errores y guía para maximizar el uso del sistema',
    usageConditions: 'Requiere suscripción Pro plan activa. Acceso mediante credenciales autorizadas. Prohibido el uso indebido o la reventa del soporte',
    minProduction: '1 cliente activo',
    maxProduction: 'Escalable según demanda y capacidad del equipo de soporte',
    other: 'NA',
    badge: 'Recomendado',
    badgeColor: 'bg-purple-500'
  }
};

const PromotionalPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const tipTimer = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % marketingTips.length);
      }, 4000);
      return () => clearInterval(tipTimer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleBasicPlan = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const handleProPlan = () => {
    window.open('https://wa.me/+573153993202', '_blank');
  };

  const plan = plans[selectedPlan];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)] w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp relative border border-blue-500/30">
        
        {/* Botón de cierre */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all duration-300 text-red-400 hover:text-white border border-red-500/30"
          aria-label="Cerrar popup"
        >
          <FaTimes size={20} />
        </button>

        {/* Efecto decorativo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex flex-col lg:flex-row overflow-hidden h-full">
          
          {/* Sección Izquierda - Marketing Tips */}
          <div className="lg:w-96 bg-gradient-to-b from-blue-600/20 to-purple-600/20 p-6 border-r border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
                  <FaStar className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-white">Tu Hotel, Tu Éxito</h3>
                <p className="text-blue-200 text-sm">Impulsa tu negocio al máximo</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                <p className="text-white text-sm leading-relaxed transition-all duration-500">
                  {marketingTips[currentTip]}
                </p>
              </div>

              <div className="flex gap-1 justify-center mb-6">
                {marketingTips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTip ? 'bg-blue-400 w-6' : 'bg-blue-400/30'}`}
                  ></div>
                ))}
              </div>

              <div className="space-y-3 pb-4">
                <div className="flex items-center text-blue-200 text-sm">
                  <FaCheckCircle className="text-green-400 mr-2 flex-shrink-0" />
                  Sistema 100% en la nube
                </div>
                <div className="flex items-center text-blue-200 text-sm">
                  <FaShieldAlt className="text-purple-400 mr-2 flex-shrink-0" />
                  Seguridad bancaria
                </div>
                <div className="flex items-center text-blue-200 text-sm">
                  <FaClock className="text-yellow-400 mr-2 flex-shrink-0" />
                  Soporte continuo
                </div>
                <div className="flex items-center text-blue-200 text-sm">
                  <FaUsers className="text-pink-400 mr-2 flex-shrink-0" />
                  +1000 hoteles felices
                </div>
              </div>
            </div>
          </div>

          {/* Sección Derecha - Planes */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-4rem)]">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                GG Hotel Manager
              </h2>
              <p className="text-blue-300 text-lg">Transforma la gestión de tu hotel</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-800/50 rounded-xl p-1 mb-6 max-w-md mx-auto">
              <button
                onClick={() => setSelectedPlan('basic')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedPlan === 'basic'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
              >
                Basic Plan
              </button>
              <button
                onClick={() => setSelectedPlan('pro')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedPlan === 'pro'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
              >
                Pro Plan
              </button>
            </div>

            {/* Badge */}
            {selectedPlan === 'pro' && (
              <div className="text-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${plan.badgeColor}`}>
                  ⭐ {plan.badge}
                </span>
              </div>
            )}

            {/* Contenido */}
            <div className="space-y-4">
              {/* Nombre comercial */}
              <div className="text-center py-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white">{plan.commercialName}</h3>
              </div>

              {/* Descripción */}
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                  <FaRocket className="mr-2" /> Descripción General
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">{plan.description}</p>
              </div>

              {/* Condiciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <span className="text-xs font-semibold text-green-400 uppercase">Horario</span>
                  <p className="text-green-100 text-sm mt-1">{plan.specialConditions.schedule}</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <span className="text-xs font-semibold text-purple-400 uppercase">Duración</span>
                  <p className="text-purple-100 text-sm mt-1">{plan.specialConditions.duration}</p>
                </div>
              </div>

              {/* Actividades */}
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.includedActivities.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-4 h-4 mt-1 mr-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                      <span className="text-blue-200 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garantía */}
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Garantía</h4>
                <p className="text-yellow-100 text-sm">{plan.guarantee}</p>
              </div>

              {/* Condiciones de uso */}
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h4 className="text-sm font-semibold text-red-400 mb-2">Condiciones de Uso</h4>
                <p className="text-red-100 text-sm">{plan.usageConditions}</p>
              </div>

              {/* Producción */}
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <h4 className="text-sm font-semibold text-blue-300 mb-3">Capacidad de Producción</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-xs text-blue-400">Mínimo</span>
                    <p className="text-blue-100 font-semibold">{plan.minProduction}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-xs text-blue-400">Máximo</span>
                    <p className="text-blue-100 font-semibold">{plan.maxProduction}</p>
                  </div>
                </div>
              </div>

              {plan.other !== 'NA' && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Características Adicionales</h4>
                  <p className="text-purple-100 text-sm">{plan.other}</p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {selectedPlan === 'basic' ? (
                <button
                  onClick={handleBasicPlan}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 border border-blue-400/30"
                >
                  🚀 Continuar con Basic Plan
                </button>
              ) : (
                <button
                  onClick={handleBasicPlan}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 border border-gray-600"
                >
                  🔄 Cambiar a Basic
                </button>
              )}
              
              {selectedPlan === 'pro' ? (
                <button
                  onClick={handleProPlan}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp Pro Plan
                </button>
              ) : (
                <button
                  onClick={handleProPlan}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 border border-green-500/30"
                >
                  <FaWhatsapp className="text-xl" />
                  Consultar Pro
                </button>
              )}
            </div>

            <p className="text-center text-blue-400/60 text-xs mt-4">
              Haz clic en cualquier parte del fondo para cerrar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;