'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalInfoPage() {

  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    telefono: "",
    roomType: "", // ✅ nuevo campo

  });
  const [reserva, setReserva] = useState<any>(null);

  // Cargar datos de la reserva existente desde localStorage
  useEffect(() => {
    const reservaData = localStorage.getItem("reserva");
    if (reservaData) {
      const parsed = JSON.parse(reservaData);
      setReserva(parsed);
      setForm({
        nombre: parsed.nombre || "",
        apellido: parsed.apellido || "",
        documento: parsed.documento || "",
        email: parsed.email || "",
        telefono: parsed.telefono || "",
        roomType: parsed.roomType || "", // ✅ carga si ya existe
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserva) return;

    const datosCompletos = { ...reserva, ...form, roomType: form.roomType || reserva.roomType, createdAt: reserva.createdAt || new Date().toISOString() };

    try {
      const res = await fetch(`/api/reserva/${reserva.id || ""}`, {
        method: reserva.id ? "PUT" : "POST", // PUT si ya existe
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosCompletos),
      });

      if (res.ok) {
        // Guardar la reserva confirmada en localStorage para el Dashboard
        localStorage.setItem("reservaCompleta", JSON.stringify(datosCompletos));
        // Limpiar la reserva temporal
        localStorage.removeItem("reserva");
        // Redirigir a confirmación
        router.push("/reserva-confirmada");
      } else {
        alert("Error al guardar los datos");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };
  const formatCOP = (n: number) =>
    (n ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP" });
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-2xl backdrop-blur">
          <div className="absolute inset-x-0 -top-20 h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 blur-3xl opacity-20 pointer-events-none" />
          <div className="px-6 sm:px-10 pt-8 pb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-800">
              Formulario de Reserva
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Verifica tu resumen y completa tus datos para confirmar
            </p>
          </div>
          <div className="px-4 sm:px-10 pb-10">
            {reserva ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr className="text-gray-700">
                      <th className="p-3 text-left font-semibold border-b">Habitación</th>
                      <th className="p-3 text-left font-semibold border-b">Check-in</th>
                      <th className="p-3 text-left font-semibold border-b">Check-out</th>
                      <th className="p-3 text-left font-semibold border-b">Adultos</th>
                      <th className="p-3 text-left font-semibold border-b">Niños</th>
                      <th className="p-3 text-left font-semibold border-b">Noches</th>
                      <th className="p-3 text-left font-semibold border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd:bg-white even:bg-slate-50">
                      <td className="p-3 border-b">
                        {reserva.roomType || "No especificado"}
                      </td>
                      <td className="p-3 border-b">{new Date(reserva.checkinDate).toLocaleDateString()}</td>
                      <td className="p-3 border-b">{new Date(reserva.checkoutDate).toLocaleDateString()}</td>
                      <td className="p-3 border-b">{reserva.adults}</td>
                      <td className="p-3 border-b">{reserva.noOfChildren}</td>
                      <td className="p-3 border-b">{reserva.nights}</td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 font-semibold">
                          {formatCOP(reserva.totalCOP)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-6 rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                Aún no hay una reserva en progreso
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full">
                  <tbody className="text-sm sm:text-base">
                    {[
                      { label: "Nombre", name: "nombre", type: "text" },
                      { label: "Apellido", name: "apellido", type: "text" },
                      { label: "Documento", name: "documento", type: "text" },
                      { label: "Teléfono", name: "telefono", type: "tel" },
/*                       { label: "Tipo de Habitación", name: "roomType", type: "text" }, // ✅ nuevo campo
 */
                    ].map((field) => (
                      <tr key={field.name} className="odd:bg-white even:bg-slate-50">
                        <td className="w-40 sm:w-56 p-3 sm:p-4 font-medium text-gray-700 align-middle border-b">
                          <label htmlFor={field.name}>{field.label}</label>
                        </td>
                        <td className="p-3 sm:p-4 border-b">
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type as any}
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none ring-offset-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder={field.label}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* ✅ Nuevo campo select */}
                    <tr className="odd:bg-white even:bg-slate-50">
                      <td className="w-40 sm:w-56 p-3 sm:p-4 font-medium text-gray-700 align-middle border-b">
                        <label htmlFor="roomType">Tipo de Habitación</label>
                      </td>
                      <td className="p-3 sm:p-4 border-b">
                        <select
                          id="roomType"
                          name="roomType"
                          value={form.roomType}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none ring-offset-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="">Selecciona un tipo</option>
                          <option value="basic">Basic</option>
                          <option value="luxury">Luxury</option>
                          <option value="suite">Suite</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold shadow hover:bg-blue-700 active:scale-[.99] transition"
                        >
                          Guardar Cambios
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-center text-xs text-gray-500">
                Al continuar aceptas nuestras políticas de privacidad y términos del servicio.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
