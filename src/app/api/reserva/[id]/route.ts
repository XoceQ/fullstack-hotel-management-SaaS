// src/app/api/reserva/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const prisma = new PrismaClient();

// 🔹 GET una sola reserva por id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(params.id) },
    });

    if (!reserva || reserva.email !== session.user.email) {
      return NextResponse.json({ message: 'No encontrado o sin permisos' }, { status: 404 });
    }

    return NextResponse.json(reserva, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ message: 'Error al obtener la reserva' }, { status: 500 });
  }
}

// 🔹 PUT editar una reserva
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const body = await req.json();
  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(params.id) } });

    if (!reserva || reserva.email !== session.user.email) {
      return NextResponse.json({ message: 'No encontrado o sin permisos' }, { status: 404 });
    }

    const updatedReserva = await prisma.reserva.update({
      where: { id: Number(params.id) },
      data: body, // ⚠️ valida qué campos permites actualizar
    });

    return NextResponse.json(updatedReserva, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ message: 'Error al actualizar la reserva' }, { status: 500 });
  }
}

// 🔹 DELETE eliminar una reserva
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(params.id) } });

    if (!reserva || reserva.email !== session.user.email) {
      return NextResponse.json({ message: 'No encontrado o sin permisos' }, { status: 404 });
    }

    await prisma.reserva.delete({ where: { id: Number(params.id) } });

    return NextResponse.json({ message: 'Reserva eliminada' }, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ message: 'Error al eliminar la reserva' }, { status: 500 });
  }
}
