// src/app/api/reserva/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 👉 Función para fijar el check-in a las 3PM hora Bogotá
function ajustarCheckinABogota(fecha: string) {
  const partes = fecha.split('T')[0]; // solo la fecha YYYY-MM-DD
  const fechaConHora = new Date(`${partes}T00:00:00-05:00`);
  return new Date(fechaConHora.toISOString()); // UTC
}

// 👉 Función para obtener la hora actual en Bogotá (UTC-5)
function obtenerAhoraBogota() {
  const now = new Date();
  const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  return utcMinus5;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    userId, nombre, apellido, documento, email, telefono,
    checkinDate, adults, noOfChildren, nights, totalCOP
  } = body;

  if (!nombre || !apellido || !documento || !email || !telefono) {
    return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
  }

  // ✅ Check-in fijo a las 3 PM hora Bogotá
  const checkinUtc = ajustarCheckinABogota(checkinDate);

  // ✅ Checkout: hora actual en Bogotá
  const checkoutUtc = obtenerAhoraBogota();

  try {
    const nuevaReserva = await prisma.reserva.create({
      data: {
        nombre,
        apellido,
        documento,
        email,
        telefono,
        checkinDate: checkinUtc,
        checkoutDate: checkoutUtc,
        adults,
        noOfChildren,
        nights,
        totalCOP,
      },
    });

    return NextResponse.json({ message: 'Reserva guardada', reserva: nuevaReserva }, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ message: 'Error al guardar la reserva' }, { status: 500 });
  }
}
