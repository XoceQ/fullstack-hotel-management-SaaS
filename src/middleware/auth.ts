import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

/* Todo el manejo de roles está en middleware/auth.ts.
*/

export async function requireAuth(role?: "admin" | "user") {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw { status: 401, message: "No autenticado" };
  }

  const isAdmin = session.user.email === "josefernandorevelo@gmail.com";

  if (role === "admin" && !isAdmin) {
    throw { status: 403, message: "No autorizado" };
  }

  return { email: session.user.email, role: isAdmin ? "admin" : "user" };
}
