// /app/api/gtrend-signals/route.js
import mysql from 'mysql2/promise';

export async function GET(req, res) {
    const connection = await mysql.createConnection({
        host: 'your-mysql-host',
        user: 'your-mysql-user',
        password: 'your-mysql-password',
        database: 'your-database-name'
    });

    try {
        const [rows] = await connection.execute('SELECT * FROM tbl_gtrend_signals');
        await connection.end();
        return Response.json(rows);
    } catch (error) {
        await connection.end();
        return Response.json({ error: error.message }, { status: 500 });
    }
}
