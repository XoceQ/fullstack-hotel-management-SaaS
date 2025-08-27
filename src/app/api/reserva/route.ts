// src/app/api/reserva/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const prisma = new PrismaClient();

// ✅ GET reservas de un usuario
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const reservas = await prisma.reserva.findMany({
      where: { email: session.user.email },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reservas, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ message: 'Error al obtener reservas' }, { status: 500 });
  }
}

// 👉 Función para fijar el check-in a las 3PM hora Bogotá
function ajustarCheckinABogota(fecha: string) {
  const partes = fecha.split('T')[0]; // solo la fecha YYYY-MM-DD
  const fechaConHora = new Date(`${partes}T15:00:00-05:00`); // 👈 forzar 3PM Bogotá
  return new Date(fechaConHora.toISOString()); // UTC
}

// 👉 Función para calcular checkout sumando noches
function calcularCheckout(checkin: Date, nights: number) {
  const checkout = new Date(checkin);
  checkout.setUTCDate(checkout.getUTCDate() + nights);
  return checkout;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const {
    nombre,
    apellido,
    documento,
    telefono,
    checkinDate,
    adults,
    noOfChildren,
    nights,
    totalCOP,
  } = body;

  if (!nombre || !apellido || !documento || !telefono || !checkinDate || !nights) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }

  // ✅ Check-in fijo a las 3 PM hora Bogotá
  const checkinUtc = ajustarCheckinABogota(checkinDate);

  // ✅ Checkout calculado sumando noches
  const checkoutUtc = calcularCheckout(checkinUtc, nights);

  try {
    const nuevaReserva = await prisma.reserva.create({
      data: {
        nombre,
        apellido,
        documento,
        email: session.user.email, // 👈 siempre del usuario autenticado
        telefono,
        checkinDate: checkinUtc,
        checkoutDate: checkoutUtc,
        adults,
        noOfChildren,
        nights,
        totalCOP,
      },
    });

    return NextResponse.json(
      { message: "Reserva guardada", reserva: nuevaReserva },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json(
      { message: "Error al guardar la reserva" },
      { status: 500 }
    );
  }
}
