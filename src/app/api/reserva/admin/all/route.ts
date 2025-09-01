import { NextResponse } from 'next/server';
import mariadb from 'mariadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

// Creamos el pool de MariaDB
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',      // tu usuario de MariaDB
    password: 'root',
    database: 'hoteldb',   // tu base de datos
    connectionLimit: 5,
});

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    if (session.user.email !== 'josefernandorevelo@gmail.com') {
        return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    try {
        const reservas = await pool.query('SELECT * FROM reserva ORDER BY createdAt DESC');
        return NextResponse.json(reservas);
    } catch (error) {
        console.error('[API ERROR RESERVAS]', error);
        return NextResponse.json({ message: 'Error al obtener reservas' }, { status: 500 });
    }
}
