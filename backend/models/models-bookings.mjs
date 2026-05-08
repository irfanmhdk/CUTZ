import db from '../config/db.mjs';

export const getBook = async (s = '') => {
        const [rows] = await db.promise().query('SELECT * FROM VBookings WHERE Customer LIKE ? OR Kapster LIKE ? OR Layanan LIKE ? OR Waktu_mulai LIKE ? OR Waktu_selesai LIKE ? OR Harga LIKE ? OR Status_bayar LIKE ? OR Bukti LIKE ? OR Status_bookings LIKE ?',
            [`%${s}%`,`%${s}%`, `%${s}%`,`%${s}%`, `%${s}%`,`%${s}%`,`%${s}%`,`%${s}%`,`%${s}%`]);
        return rows;
}

export const getCekBook = async () => {
    const [rows] = await db.promise().query(`SELECT * FROM VBookings WHERE Status_bookings = 'Pending' AND Status_bookings = 'Success' ORDER BY Waktu_mulai DESC`);
    return rows;
}

export const getMyBook = async (id, role) => {
    const cek = (role === 'Barber') ? 'Barbers_id' : 'Users_id';

    const [rows] = await db.promise().query(`SELECT * FROM VBookings WHERE ${cek} = ? ORDER BY Waktu_mulai DESC`, [id]);
    return rows;
}

export const postBook = async (data) => {
    const { Users_id, Barbers_id, Services_id, Start_time, Total_harga, bukti } = data;
    const [service] = await db.promise().query(
        'SELECT Estimasi FROM services WHERE Services_id = ?',
        [Services_id]
    );

    if (service.length === 0) return res.status(404).json({ pesan: 'Layanan tidak ditemukan' });

    const durasiMenit = service[0].Estimasi;
    const start = new Date(Start_time);
    const end = new Date(start.getTime() + durasiMenit * 60000);

    const [result] = await db.promise().query(
        `INSERT INTO bookings 
            (Users_id, Barbers_id, Services_id, Start_time, End_time, Total_harga, Bukti) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [Users_id, Barbers_id, Services_id, start, end, Total_harga, bukti]
    );

    return result;
}

export const updBook = async (id, data) => {
    const { Status_bookings, Status_bayar } = data;
    const [result] = await db.promise().query('UPDATE bookings SET Bookings_status = ?, Status_bayar = ? WHERE Bookings_id = ?', [Status_bookings, Status_bayar, id]);
    return result;
}