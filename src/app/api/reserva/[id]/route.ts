// src/app/api/reserva/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { requireAuth } from "@/middleware/auth";
import { handleUpdateReserva, handleDeleteReserva } from "@/controllers/reservaController";


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


  // 🔹 PUT editar cualquier reserva solo ADMIN
/* export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const body = await req.json();
  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(params.id) } });
    if (!reserva) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    // Admin puede actualizar cualquier reserva
    const isAdmin = session.user.email === 'josefernandorevelo@gmail.com';

    // Usuario normal solo puede actualizar su propia reserva
    if (!isAdmin && reserva.email !== session.user.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    const updatedReserva = await prisma.reserva.update({
      where: { id: Number(params.id) },
      data: body, // ⚠️ valida qué campos permites actualizar
    });

    return NextResponse.json(updatedReserva, { status: 200 });
  } catch (error) {
    console.error('[API ERROR UPDATE RESERVA]', error);
    return NextResponse.json({ message: 'Error al actualizar la reserva' }, { status: 500 });
  }
} */


// 🔹 DELETE eliminar una reserva solo ADMIN
/* export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(params.id) } });
    if (!reserva) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    // Admin puede eliminar cualquier reserva
    const isAdmin = session.user.email === 'josefernandorevelo@gmail.com';

    // Usuario normal solo puede eliminar su propia reserva
    if (!isAdmin && reserva.email !== session.user.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    await prisma.reserva.delete({ where: { id: Number(params.id) } });

    return NextResponse.json({ message: 'Reserva eliminada' }, { status: 200 });
  } catch (error) {
    console.error('[API ERROR DELETE RESERVA]', error);
    return NextResponse.json({ message: 'Error al eliminar la reserva' }, { status: 500 });
  }
} */


  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(); // puede admin o user
    const body = await req.json();
    const updated = await handleUpdateReserva(Number(params.id), body, user);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.status || 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(); // puede admin o user
    const result = await handleDeleteReserva(Number(params.id), user);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.status || 500 });
  }
}