'use client'; 

import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaEdit, FaTrash, FaPlus, FaFileExcel, FaFilePdf, FaUsers, FaEye } from 'react-icons/fa';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '../(web)/loading';

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
  createdAt?: string;
  userId?: string; // ID del usuario que hizo la reserva
  userName?: string; // Nombre del usuario propietario
};

const AdminDashboard = () => {
  type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id: string;
    role?: string; // Add role as optional
    accessToken?: string; // If you use accessToken elsewhere
  };
  
  const { data: session, status } = useSession() as {
    data: { user?: SessionUser } | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  const [todasLasReservas, setTodasLasReservas] = useState<Reserva[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'by-user'>('all');
  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => setIsClient(true), []);

  // Cargar TODAS las reservas del sistema
 useEffect(() => {
  if (!isClient) return;

  const fetchTodasLasReservas = async () => {
    setLoading(true);
    try {
      // Endpoint específico para admin que retorna todas las reservas
      const res = await fetch('/api/reserva', {
        headers: {
          'Authorization': `Bearer ${(session as any)?.user?.accessToken || ''}`,
          'X-Admin-Access': 'true' // Header especial para identificar acceso de admin
        }
      });
      
      if (res.ok) {
        const data: Reserva[] = await res.json();
        setTodasLasReservas(data);
        // Guardar en localStorage como backup
        localStorage.setItem('adminTodasReservas', JSON.stringify(data));
        setLoading(false);
        return;
      }
    } catch (error) {
      console.warn('API no disponible, intentando con localStorage');
    }

    // Fallback: cargar desde localStorage si la API falla
    const local = localStorage.getItem('adminTodasReservas');
    if (local) {
      setTodasLasReservas(JSON.parse(local));
    } else {
      const normalReservas = localStorage.getItem('todasLasReservas');
      if (normalReservas) {
        setTodasLasReservas(JSON.parse(normalReservas));
      }
    }
    setLoading(false);
  };

  fetchTodasLasReservas();
}, [isClient, session]);


  // Detectar cambios desde edición
  useEffect(() => {
    const updatedReserva = localStorage.getItem('reservaCompleta');
    if (updatedReserva) {
      const parsed = JSON.parse(updatedReserva);
      setTodasLasReservas(prev => prev.map(r => r.id === parsed.id ? parsed : r));
      setShowModal(true);
      localStorage.removeItem('reservaCompleta');
    }
  }, []);

  const formatCOP = (n: number) =>
    (n ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatDateSimple = (d: string) => new Date(d).toLocaleDateString('es-CO');

  const handleDeleteReserva = async (id: string) => {
    if (!window.confirm('¿Eliminar esta reserva? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch(`/api/admin/reserva/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(session as any)?.user?.accessToken || ''}`,
          'X-Admin-Access': 'true'
        }
      });
      
      if (!res.ok) throw new Error('Error API');
      
      setTodasLasReservas(prev => prev.filter(r => r.id !== id));
      toast.success('Reserva eliminada por el administrador ✅');
    } catch {
      toast.error('Error al eliminar reserva ❌');
    }
  };

  const handleEditReserva = (reserva: Reserva) => {
    localStorage.setItem('reserva', JSON.stringify(reserva));
    localStorage.setItem('adminMode', 'true'); // Indicar que es edición de admin
    window.location.href = '/personal-info';
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellido', 'Documento', 'Email', 'Teléfono', 'Check-in', 'Check-out', 'Adultos', 'Niños', 'Noches', 'Total COP', 'Usuario Propietario'];
    const csvContent = [
      headers.join(','),
      ...todasLasReservas.map(r => [
        r.nombre, r.apellido, r.documento, r.email, r.telefono,
        formatDateSimple(r.checkinDate), formatDateSimple(r.checkoutDate),
        r.adults, r.noOfChildren, r.nights, r.totalCOP, r.userName || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todas-reservas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Obtener usuarios únicos
  const usuariosUnicos = Array.from(new Set(
    todasLasReservas
      .filter(r => r.userName)
      .map(r => r.userName!)
  ));

  // Filtrar reservas según el modo de vista
  const reservasFiltradas = viewMode === 'all' 
    ? todasLasReservas 
    : todasLasReservas.filter(r => r.userName === selectedUser);

  if (!isClient || status === 'loading' || loading) return <LoadingSpinner />;

  // Remover validación de sesión para superusuario
  // El admin puede acceder sin autenticación
  const isAdmin = session?.user?.email === 'admin@tuhotel.com' || 
                  session?.user?.role === 'admin' || 
                  !session; // Permitir acceso sin sesión

  if (!isAdmin && session) {
    return <p className="text-center text-red-600">Acceso restringido solo para administradores</p>;
  }

  const totalIngresos = reservasFiltradas.reduce((sum, r) => sum + r.totalCOP, 0);
  const totalReservas = reservasFiltradas.length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">✅ ¡Reserva Actualizada!</h2>
            <p className="text-gray-700 mb-4">Los datos se actualizaron correctamente.</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 bg-white shadow-lg rounded-xl p-6 text-center space-y-6 h-fit sticky top-10">
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Avatar'}
                width={112}
                height={112}
                className="rounded-full object-cover"
              />
            ) : (
              <FaUsers className="text-white text-4xl" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {session?.user?.name || 'Superadministrador'}
            </h2>
            <p className="text-sm text-gray-500">
              {session?.user?.email || 'admin@sistema.com'}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              SUPERUSUARIO
            </span>
          </div>
          {/* Estadísticas */}
          <div className="space-y-3 text-left">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {viewMode === 'all' ? 'Total Sistema' : 'Reservas Usuario'}
                </p>
                <p className="text-xl font-bold text-blue-600">{totalReservas}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Ingresos</p>
              <p className="text-lg font-bold text-purple-600">{formatCOP(totalIngresos)}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-lg font-bold text-green-600">{usuariosUnicos.length}</p>
            </div>
          </div>
          {/* Controles de exportación */}
          <div className="space-y-2">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-green-700 transition"
            >
              <FaFileExcel /> Exportar CSV
            </button>
          </div>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-red-700 transition"
            >
              <FaSignOutAlt className="text-lg" /> Cerrar Sesión
            </button>
          )}
        </aside>
        {/* Main content */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Panel de Superadministrador
            </h1>
            {/* Controles de vista */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode('all');
                  setSelectedUser('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaEye className="inline mr-2" />
                Todas las Reservas
              </button>
              <button
                onClick={() => setViewMode('by-user')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'by-user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaUsers className="inline mr-2" />
                Por Usuario
              </button>
            </div>
          </div>
          {/* Selector de usuario */}
          {viewMode === 'by-user' && (
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Usuario:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">-- Seleccionar Usuario --</option>
                {usuariosUnicos.map(usuario => (
                  <option key={usuario} value={usuario}>
                    {usuario} ({todasLasReservas.filter(r => r.userName === usuario).length} reservas)
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Alertas de información */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Modo Superadministrador:</strong> Tienes acceso completo a todas las reservas del sistema.
                  {viewMode === 'by-user' && selectedUser && (
                    <span className="block mt-1">
                      Viendo reservas de: <strong>{selectedUser}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Lista de reservas */}
          {reservasFiltradas.length > 0 ? (
            <div className="space-y-4">
              {reservasFiltradas.map(reserva => (
                <div key={reserva.id} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {reserva.nombre} {reserva.apellido}
                      </h4>
                      <p className="text-gray-600"><strong>Email:</strong> {reserva.email}</p>
                      <p className="text-sm text-gray-600"><strong>CC:</strong> {reserva.documento}</p>
                      {reserva.userName && (
                        <p className="text-sm text-purple-600 font-medium">
                          <strong>Usuario Propietario:</strong> {reserva.userName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditReserva(reserva)} 
                        className="p-2 text-green-600 hover:bg-green-100 rounded transition" 
                        title="Editar reserva"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteReserva(reserva.id!)} 
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition" 
                        title="Eliminar reserva"    
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <p><strong>Teléfono:</strong> {reserva.telefono}</p>
                    <p><strong>Check-in:</strong> {formatDate(reserva.checkinDate)}</p>
                    <p><strong>Check-out:</strong> {formatDate(reserva.checkoutDate)}</p>
                    <p><strong>Adultos:</strong> {reserva.adults}</p>
                    <p><strong>Niños:</strong> {reserva.noOfChildren}</p>
                    <p><strong>Noches:</strong> {reserva.nights}</p>
                    <p><strong>Total:</strong> <span className="text-green-600 font-semibold">{formatCOP(reserva.totalCOP)}</span></p>
                    {reserva.createdAt && (
                      <p><strong>Creada:</strong> {formatDateSimple(reserva.createdAt)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-xl p-8 text-gray-600 text-center">
              <div className="text-6xl mb-4">
                {viewMode === 'by-user' && !selectedUser ? '👥' : '📭'}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {viewMode === 'by-user' && !selectedUser 
                  ? 'Selecciona un usuario' 
                  : 'No hay reservas'
                }
              </h3>
              <p className="mb-6">
                {viewMode === 'by-user' && !selectedUser
                  ? 'Elige un usuario del menú desplegable para ver sus reservas.'
                  : viewMode === 'by-user'
                  ? `El usuario ${selectedUser} no tiene reservas registradas.`
                  : 'No hay reservas en el sistema.'
                }
              </p>
              
              {(!selectedUser || viewMode === 'all') && (
                <Link 
                  href="/rooms" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <FaPlus /> Crear Nueva Reserva
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;