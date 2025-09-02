import * as reservaService from "@/services/reservaService";
//Los controllers validan permisos y orquestan servicios.

export async function handleUpdateReserva(id: number, data: any, user: any) {
  const reserva = await reservaService.getReservaById(id);
  if (!reserva) {
    throw { status: 404, message: "Reserva no encontrada" };
  }

  if (user.role !== "admin" && reserva.email !== user.email) {
    throw { status: 403, message: "No autorizado" };
  }

  return await reservaService.updateReserva(id, data);
}

export async function handleDeleteReserva(id: number, user: any) {
  const reserva = await reservaService.getReservaById(id);
  if (!reserva) {
    throw { status: 404, message: "Reserva no encontrada" };
  }

  if (user.role !== "admin" && reserva.email !== user.email) {
    throw { status: 403, message: "No autorizado" };
  }

  await reservaService.deleteReserva(id);
  return { message: "Reserva eliminada correctamente" };
}
