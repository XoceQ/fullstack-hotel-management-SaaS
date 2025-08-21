'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalInfoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    telefono: '',
  });

  const [reserva, setReserva] = useState<any>(null);

  useEffect(() => {
    const reservaData = localStorage.getItem("reserva");
    if (reservaData) {
      setReserva(JSON.parse(reservaData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datosCompletos = { ...form, ...reserva };

    try {
      const res = await fetch('/api/reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosCompletos),
      });

      if (res.ok) {
        localStorage.removeItem("reserva");
        router.push('/reserva-confirmada');
      } else {
        alert('Error al guardar los datos');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-10 space-y-10">
        <h1 className="text-4xl font-bold text-center text-blue-800">Formulario de Reserva</h1>

        {reserva && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg border text-gray-700">
            <p><strong>Check-in:</strong> {new Date(reserva.checkinDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(reserva.checkoutDate).toLocaleDateString()}</p>
            <p><strong>Adultos:</strong> {reserva.adults}</p>
            <p><strong>Niños:</strong> {reserva.noOfChildren}</p>
            <p><strong>Noches:</strong> {reserva.nights}</p>
            <p><strong>Total:</strong> ${reserva.totalCOP.toLocaleString('es-CO')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="nombre" type="text" placeholder="Nombre" onChange={handleChange} required className="p-4 border rounded-lg shadow-sm" />
          <input name="apellido" type="text" placeholder="Apellido" onChange={handleChange} required className="p-4 border rounded-lg shadow-sm" />
          <input name="documento" type="text" placeholder="Documento" onChange={handleChange} required className="p-4 border rounded-lg shadow-sm" />
          <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required className="p-4 border rounded-lg shadow-sm" />
          <input name="telefono" type="tel" placeholder="Teléfono" onChange={handleChange} required className="p-4 border rounded-lg shadow-sm" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg col-span-1 md:col-span-2 shadow-md text-lg font-semibold">
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}
