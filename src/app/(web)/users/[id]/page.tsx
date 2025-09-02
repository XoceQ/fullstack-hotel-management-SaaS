'use client';

import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaEdit, FaTrash, FaEye, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import LoadingSpinner from '../../loading';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaUserShield } from "react-icons/fa";


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
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false); // <-- Modal flag


  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient || !session?.user?.email) return;

    const loadReservas = async () => {
      try {
        const endpoint =
          session.user.email === "josefernandorevelo@gmail.com"
            ? "/api/reserva/admin/all" // endpoint para admin
            : "/api/reserva"; // endpoint normal

        const res = await fetch(endpoint);
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
  }, [isClient, session]);


  // 🔄 Detecta cambios desde la página de edición
  useEffect(() => {
    const updatedReserva = localStorage.getItem("reservaCompleta");
    if (updatedReserva) {
      const parsed = JSON.parse(updatedReserva);
      setReservas((prev) =>
        prev.map((r) => (r.id === parsed.id ? parsed : r))
      );
      setShowModal(true); // <-- Mostrar modal
      localStorage.removeItem("reservaCompleta");
    }
  }, []);



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

  const formatDateSimple = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  // 📄 Función para exportar a PDF
  const exportToPDF = () => {
    if (reservas.length === 0) {
      toast.error("No hay reservas para exportar");
      return;
    }

    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Reservas</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .user-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .total { font-weight: bold; color: #16a085; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Reporte de Reservas</h1>
          <p>Generado el: ${new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
        </div>
        
        <div class="user-info">
          <h3>👤 Información del Usuario</h3>
          <p><strong>Nombre:</strong> ${session?.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${session?.user?.email || 'N/A'}</p>
          <p><strong>Total de Reservas:</strong> ${reservas.length}</p>
          <p><strong>Total de Ingresos:</strong> ${formatCOP(reservas.reduce((sum, r) => sum + r.totalCOP, 0))}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Adultos</th>
              <th>Niños</th>
              <th>Noches</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(reserva => `
              <tr>
                <td>${reserva.nombre} ${reserva.apellido}</td>
                <td>${reserva.documento}</td>
                <td>${reserva.email}</td>
                <td>${reserva.telefono}</td>
                <td>${formatDateSimple(reserva.checkinDate)}</td>
                <td>${formatDateSimple(reserva.checkoutDate)}</td>
                <td>${reserva.adults}</td>
                <td>${reserva.noOfChildren}</td>
                <td>${reserva.nights}</td>
                <td class="total">${formatCOP(reserva.totalCOP)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Este reporte contiene información confidencial. Manténgalo seguro.</p>
        </div>
      </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas_${session?.user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("📄 Archivo PDF (HTML) generado exitosamente");
  };

  // 📊 Función para exportar a Excel (CSV)
  const exportToExcel = () => {
    if (reservas.length === 0) {
      toast.error("No hay reservas para exportar");
      return;
    }

    // Crear encabezados CSV
    const headers = [
      'Nombre',
      'Apellido',
      'Documento',
      'Email',
      'Teléfono',
      'Check-in',
      'Check-out',
      'Adultos',
      'Niños',
      'Noches',
      'Total (COP)',
      'Fecha de Creación'
    ];

    // Convertir datos a CSV
    const csvContent = [
      headers.join(','),
      ...reservas.map(reserva => [
        `"${reserva.nombre}"`,
        `"${reserva.apellido}"`,
        `"${reserva.documento}"`,
        `"${reserva.email}"`,
        `"${reserva.telefono}"`,
        `"${formatDateSimple(reserva.checkinDate)}"`,
        `"${formatDateSimple(reserva.checkoutDate)}"`,
        reserva.adults,
        reserva.noOfChildren,
        reserva.nights,
        reserva.totalCOP,
        `"${reserva.createdAt ? formatDateSimple(reserva.createdAt) : 'N/A'}"`
      ].join(','))
    ].join('\n');

    // Agregar BOM para caracteres especiales
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas_${session?.user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("📊 Archivo Excel (CSV) generado exitosamente");
  };

  /*   const handleDeleteReserva = async (id: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
        try {
          const res = await fetch(`/api/reserva/${id}`, {
            method: "DELETE",
          });
  
          if (!res.ok) throw new Error("Error en API");
  
          setReservas(reservas.filter((r) => r.id !== id));
          toast.success("Reserva eliminada exitosamente ✅");
        } catch (error) {
          toast.error("Error al eliminar la reserva ❌");
        }
      }
    }; */

  const handleDeleteReserva = async (id: string) => {
    if (!session?.user?.email) return;

    if (session.user.email !== 'josefernandorevelo@gmail.com') {
      toast.error('No tienes permisos para eliminar reservas');
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) return;

    try {
      const res = await fetch(`/api/reserva/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error en API');

      setReservas((prev) => prev.filter((r) => r.id !== id));
      toast.success('Reserva eliminada exitosamente ✅');
    } catch (error) {
      toast.error('Error al eliminar la reserva ❌');
    }
  };

  const handleEditReserva = (reserva: Reserva) => {
    localStorage.setItem("reserva", JSON.stringify(reserva));
    window.location.href = "/personal-info"; // Redirige al formulario para editar
  };

  if (!isClient || status === 'loading') return <LoadingSpinner />;

  if (!session?.user) {
    return <p className="text-center text-red-600">Debes iniciar sesión para acceder.</p>;
  }

  const totalIngresos = reservas.reduce((sum, r) => sum + r.totalCOP, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">✅ ¡Reserva Actualizada!</h2>
            <p className="text-gray-700 mb-4">Los datos de la reserva han sido modificados correctamente.</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
          {/* Letrero de Admin - solo visible para el admin */}
          {session.user.email === 'josefernandorevelo@gmail.com' && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              ADMIN
            </div>
          )}

          
          <h2 className="text-xl font-bold text-gray-800">{session.user.name}</h2>
          <p className="text-sm text-gray-500">{session.user.email}</p>

          {/* Estadísticas rápidas */}
          <div className="space-y-3 text-left">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservas (pago pendiente)</p>
                <p className="text-xl font-bold text-blue-600">{reservas.length}</p>
              </div>

              {/* Mini botón WhatsApp */}
              <a
                href="https://wa.me/573153993202?text=Hola%20quisiera%20más%20información%20sobre%20mi%20reserva"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
                title="Chatea con nosotros"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M16 .063C7.163.063 0 7.226 0 16.063c0 2.831.741 5.59 2.154 8.02L.188 31.938l8.113-1.93A15.85 15.85 0 0016 32c8.837 0 16-7.163 16-15.938C32 7.226 24.837.063 16 .063zm0 29.062c-2.492 0-4.934-.648-7.077-1.878l-.507-.297-4.813 1.146 1.021-4.692-.305-.482A12.938 12.938 0 013.063 16c0-7.168 5.82-12.938 12.937-12.938 7.117 0 12.938 5.77 12.938 12.938 0 7.118-5.82 12.938-12.938 12.938zm7.177-9.688c-.395-.198-2.337-1.154-2.7-1.285-.362-.132-.627-.198-.892.198-.263.395-1.024 1.285-1.255 1.55-.23.263-.461.296-.856.099-.395-.198-1.668-.615-3.176-1.96-1.173-1.045-1.965-2.336-2.197-2.731-.23-.395-.025-.608.173-.805.178-.176.395-.461.593-.691.198-.23.263-.395.395-.658.132-.263.066-.494-.033-.691-.099-.198-.892-2.154-1.223-2.95-.322-.773-.65-.668-.892-.681-.23-.012-.494-.015-.759-.015-.263 0-.691.099-1.053.494-.362.395-1.386 1.354-1.386 3.302s1.42 3.829 1.618 4.094c.198.263 2.787 4.257 6.756 5.965.944.407 1.68.651 2.253.832.947.301 1.809.258 2.49.157.76-.113 2.337-.955 2.67-1.877.329-.922.329-1.712.23-1.877-.099-.165-.362-.263-.757-.461z" />
                </svg>
              </a>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Ingresos</p>
              <p className="text-lg font-bold text-purple-600">{formatCOP(totalIngresos)}</p>
            </div>
          </div>

          {/* 📊 Botones de Exportación */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 text-left">📊 Exportar Datos</h3>

            <button
              onClick={exportToPDF}
              disabled={reservas.length === 0}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-semibold shadow transition ${reservas.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              title="Exportar a PDF"
            >
              <FaFilePdf className="text-lg" />
              Exportar PDF
            </button>

            <button
              onClick={exportToExcel}
              disabled={reservas.length === 0}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-semibold shadow transition ${reservas.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              title="Exportar a Excel"
            >
              <FaFileExcel className="text-lg" />
              Exportar Excel
            </button>
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  📋 Todas las Reservas ({reservas.length})
                </h3>

                {/* Botones de exportación en versión móvil/tablet */}
                <div className="flex gap-2 md:hidden">
                  <button
                    onClick={exportToPDF}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="Exportar PDF"
                  >
                    <FaFilePdf />
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    title="Exportar Excel"
                  >
                    <FaFileExcel />
                  </button>
                </div>
              </div>
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
                      <button
                        onClick={() => handleEditReserva(reserva)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>

                      {session.user.email === 'josefernandorevelo@gmail.com' && (
                        <button
                          onClick={() => handleDeleteReserva(reserva.id!)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          title="Eliminar reserva"
                        >
                          <FaTrash />
                        </button>
                      )}

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
            <div className="bg-white shadow-lg rounded-xl p-8 text-gray-600 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No hay reservas</h3>
              <p className="mb-6">Aún no tienes reservas registradas.</p>
              <Link href="/rooms" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                <FaPlus /> Crear Nueva Reserva
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;