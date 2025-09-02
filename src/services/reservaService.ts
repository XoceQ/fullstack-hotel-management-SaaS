import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//La lógica de negocio está en services/ (independiente de HTTP).

export async function getReservaById(id: number) {
  return prisma.reserva.findUnique({ where: { id } });
}

export async function updateReserva(id: number, data: any) {
  return prisma.reserva.update({ where: { id }, data });
}

export async function deleteReserva(id: number) {
  return prisma.reserva.delete({ where: { id } });
}
