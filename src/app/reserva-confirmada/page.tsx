'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ReservaConfirmadaPage() {
  const [reserva, setReserva] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("reservaCompleta");
    if (data) setReserva(JSON.parse(data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center space-y-6 max-w-xl bg-yellow-50 p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-600">⚠️ ¡Reserva pendiente de pago!</h1>
        <p className="text-gray-700">
          Gracias por reservar con nosotros. Tu reserva está confirmada, pero falta realizar el pago para completarla.
        </p>
        {reserva && (
          <div className="text-left text-gray-800 mt-6 space-y-2">
            <p><strong>Nombre:</strong> {reserva.nombre} {reserva.apellido}</p>
            <p><strong>Documento:</strong> {reserva.documento}</p>
              <p><strong>Teléfono:</strong> {reserva.telefono}</p>
            <p><strong>Check-in:</strong> {new Date(reserva.checkinDate).toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
              dateStyle: 'medium',
              timeStyle: 'short',
            })}</p>            <p><strong>Check-out:</strong> {new Date(reserva.checkoutDate).toLocaleDateString('es-CO')}</p>
            <p><strong>Adultos:</strong> {reserva.adults}</p>
            <p><strong>Niños:</strong> {reserva.noOfChildren}</p>
            <p><strong>Noches:</strong> {reserva.nights}</p>
            <p><strong>Total (COP):</strong> ${reserva.totalCOP.toLocaleString('es-CO')}</p>
            <p>
              <strong>Fecha de creación:</strong>{" "}
              {new Date(reserva.createdAt).toLocaleString("es-CO", {
                timeZone: "America/Bogota",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        )}
       {/*  Botones ahora dentro del contenedor amarillo */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
         <a
          href="https://wa.me/573153993202?text=Hola,%20quiero%20más%20información%20sobre%20el%20pago"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Realizar Pago
        </a>
         <Link
            href="/auth"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Ir al Dashboard
        </Link>
        </div>
      </div>
    </div>
  );
}