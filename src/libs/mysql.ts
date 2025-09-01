import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hoteldb',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('tu_contraseña\0'),
  },
});
