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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const datosCompletos = {
      ...form,
      ...reserva,
    };

    // 🔄 Aquí puedes enviar los datos al backend
    console.log("Reserva completa:", datosCompletos);

    // (Opcional) Limpiar el localStorage
    localStorage.removeItem("reserva");

    // Redirigir a página de confirmación
    router.push('/reserva-confirmada');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Datos del cliente</h1>

      {reserva && (
        <div className="mb-6 p-4 bg-gray-100 rounded border">
          <p><strong>Check-in:</strong> {new Date(reserva.checkinDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {new Date(reserva.checkoutDate).toLocaleDateString()}</p>
          <p><strong>Adultos:</strong> {reserva.adults}</p>
          <p><strong>Niños:</strong> {reserva.noOfChildren}</p>
          <p><strong>Noches:</strong> {reserva.nights}</p>
          <p><strong>Total:</strong> ${reserva.totalCOP.toLocaleString('es-CO')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" type="text" placeholder="Nombre" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="apellido" type="text" placeholder="Apellido" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="documento" type="text" placeholder="Documento" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="telefono" type="tel" placeholder="Teléfono" onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="btn-primary w-full">Enviar</button>
      </form>
    </div>
  );
}
