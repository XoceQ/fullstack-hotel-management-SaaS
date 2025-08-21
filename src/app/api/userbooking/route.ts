// pages/api/userbooking.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'Falta userId en la query' });
  }

  try {
    const reservas = await prisma.reserva.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ reservas });
  } catch (error) {
    console.error('[ERROR] userbooking.ts', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
