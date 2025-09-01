"use client";
import { useEffect, useState } from "react";

export default function BookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/getBookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Cargando reservas...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>
      <div className="space-y-4">
        {bookings.map((reserva) => (
          <div key={reserva._id} className="p-4 border rounded shadow-sm">
            <p><strong>Cliente:</strong> {reserva.user?.nombre} {reserva.user?.apellido}</p>
            <p><strong>Email:</strong> {reserva.user?.email}</p>
            <p><strong>Check-in:</strong> {new Date(reserva.checkinDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(reserva.checkoutDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${reserva.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
