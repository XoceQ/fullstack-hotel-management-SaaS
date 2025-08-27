'use client';

import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import LoadingSpinner from '../../loading';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Reserva = {
  id?: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  noOfChildren: number;
  nights: number;
  totalCOP: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'single'>('list');

  useEffect(() => {
    setIsClient(true);
  }, []);

useEffect(() => {
  if (!isClient) return;

  const loadReservas = async () => {
    try {
      const res = await fetch("/api/reserva");
      if (res.ok) {
        const data: Reserva[] = await res.json();
        setReservas(data);
        return;
      }
    } catch (error) {
      console.warn("❌ API no disponible, usando localStorage como fallback");
    }

    // 🔄 Fallback: localStorage
    try {
      const allReservas = localStorage.getItem("todasLasReservas");
      if (allReservas) {
        setReservas(JSON.parse(allReservas));
      }
    } catch (error) {
      console.error("Error al cargar reservas desde localStorage:", error);
      toast.error("Error al cargar reservas");
    }
  };

  loadReservas();
}, [isClient]);



  const formatCOP = (n: number) =>
    (n ?? 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const handleDeleteReserva = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        const updatedReservas = reservas.filter(r => r.id !== id);
        setReservas(updatedReservas);
        localStorage.setItem('todasLasReservas', JSON.stringify(updatedReservas));
        toast.success('Reserva eliminada exitosamente');
      } catch (error) {
        toast.error('Error al eliminar la reserva');
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const updatedReservas = reservas.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      );
      setReservas(updatedReservas);
      localStorage.setItem('todasLasReservas', JSON.stringify(updatedReservas));
      toast.success(`Estado cambiado a ${newStatus}`);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const clearAllReservas = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todas las reservas?')) {
      setReservas([]);
      localStorage.removeItem('todasLasReservas');
      localStorage.removeItem('reservaCompleta');
      toast.success('Todas las reservas han sido eliminadas');
    }
  };

  // Verificar hidratación
  if (!isClient) {
    return <LoadingSpinner />;
  }

  if (status === 'loading') return <LoadingSpinner />;
  
  if (!session?.user) {
    return (
      <p className="text-center text-red-600">
        Debes iniciar sesión para acceder.
      </p>
    );
  }

  const totalIngresos = reservas.reduce((sum, r) => sum + r.totalCOP, 0);
  const reservasConfirmadas = reservas.filter(r => r.status === 'confirmed').length;
  const reservasPendientes = reservas.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 bg-white shadow-lg rounded-xl p-6 text-center space-y-6 h-fit sticky top-10">
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden">
            <Image
              src={session.user.image || '/default-user.png'}
              alt={session.user.name || 'User Avatar'}
              width={112}
              height={112}
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {session.user.name}
          </h2>
          <p className="text-sm text-gray-500">{session.user.email}</p>
          
          {/* Estadísticas rápidas */}
          <div className="space-y-3 text-left">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Reservas</p>
              <p className="text-xl font-bold text-blue-600">{reservas.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-xl font-bold text-green-600">{reservasConfirmadas}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{reservasPendientes}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Ingresos</p>
              <p className="text-lg font-bold text-purple-600">{formatCOP(totalIngresos)}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-red-700 transition"
          >
            <FaSignOutAlt className="text-lg" />
            Cerrar Sesión
          </button>
        </aside>

        {/* Main content */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
          </div>

          {reservas.length > 0 ? (
            currentView === 'list' ? (
              // Vista de lista
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  📋 Todas las Reservas ({reservas.length})
                </h3>
                
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-white shadow-lg rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          Nombre: {reserva.nombre} {reserva.apellido}
                        </h4>
                        <p className="text-gray-600"><strong>Correo:</strong> {reserva.email}</p>
                        <p className="text-sm text-gray-600"><strong>CC:</strong> {reserva.documento}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={reserva.status || 'pending'}
                          onChange={(e) => handleStatusChange(reserva.id!, e.target.value as any)}
                          className="text-xs px-2 py-1 rounded border"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                        
                        <button
                          onClick={() => handleViewDetails(reserva)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteReserva(reserva.id!)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <p><strong>Teléfono:</strong> {reserva.telefono}</p>
                      <p><strong>Check-in:</strong> {formatDate(reserva.checkinDate)}</p>
                      <p><strong>Check-out:</strong> {formatDate(reserva.checkoutDate)}</p>
                      <p><strong>Adultos:</strong> {reserva.adults}</p>
                      <p><strong>Niños:</strong> {reserva.noOfChildren}</p>
                      <p><strong>Noches:</strong> {reserva.nights}</p>
                      <p><strong>Total:</strong> <span className="text-green-600 font-semibold">{formatCOP(reserva.totalCOP)}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vista individual (primera reserva)
              <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  📌 Detalles de la Reserva
                </h3>
                
                

                {/* Datos personales */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p><strong>Nombre:</strong> {reservas[0].nombre} {reservas[0].apellido}</p>
                  <p><strong>Documento:</strong> {reservas[0].documento}</p>
                  <p><strong>Email:</strong> {reservas[0].email}</p>
                  <p><strong>Teléfono:</strong> {reservas[0].telefono}</p>
                </div>

                {/* Datos de reserva */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p><strong>Check-in:</strong> {formatDate(reservas[0].checkinDate)}</p>
                  <p><strong>Check-out:</strong> {formatDate(reservas[0].checkoutDate)}</p>
                  <p><strong>Adultos:</strong> {reservas[0].adults}</p>
                  <p><strong>Niños:</strong> {reservas[0].noOfChildren}</p>
                  <p><strong>Noches:</strong> {reservas[0].nights}</p>
                  <p><strong>Total:</strong> {formatCOP(reservas[0].totalCOP)}</p>
                </div>


                {reservas[0].createdAt && (
                  <p className="text-sm text-gray-500">
                    <strong>Fecha de creación:</strong>{' '}
                    {new Date(reservas[0].createdAt).toLocaleString('es-CO', {
                      timeZone: 'America/Bogota',
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}

                

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <a
                    href="/pago"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition text-center"
                  >
                    Realizar Pago
                  </a>
                  <a
                    href="/reserva-confirmada"
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition text-center"
                  >
                    Ver Confirmación
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white shadow-lg rounded-xl p-8 text-gray-600 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No hay reservas</h3>
              <p className="mb-6">Aún no tienes reservas registradas.</p>
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                <FaPlus />
                Crear Nueva Reserva
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Modal de detalles */}
  
    </div>
  );
};

export default Dashboard;
