import db from '../config/db.mjs';

export const fetchAllJadwal = async (s = '') => {
    const [rows] = await db.promise().query('SELECT * FROM jadwal INNER JOIN barbershop ON jadwal.Barbershop_id = barbershop.Barbershop_id WHERE Nama Like ? OR Hari LIKE ? OR Jam_buka LIKE ? OR Jam_tutup LIKE ?',
        [`%${s}%`,`%${s}%`,`%${s}%`,`%${s}%`]);
    return rows;
};

export const fetchJadwalByHari = async (hari) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM jadwal WHERE Hari = ? LIMIT 1',
        [hari]
    );
    return rows[0];
};

export const createJadwal = async (data) => {
    const { hari, jam_buka, jam_tutup, is_tutup } = data;
    const [result] = await db.promise().query(
        'INSERT INTO jadwal (Barbershop_id, Hari, Jam_buka, Jam_tutup, Is_tutup) VALUES (?, ?, ?, ?, ?)',
        [1, hari, jam_buka, jam_tutup, is_tutup || false]
    );
    return result;
};

export const hapusJadwal = async (id) => {
    const [result] = await db.promise().query('DELETE FROM jadwal WHERE Jadwal_id = ?', [id]);
    return result;
}

export const ubahJadwal = async (data, id) => {
    const { hari, jam_buka, jam_tutup, is_tutup } = data;
    const [result] = await db.promise().query(
        'UPDATE jadwal SET Hari = ?, Jam_buka = ?, Jam_tutup = ? , Is_tutup = ? WHERE Jadwal_id = ?',
        [hari, jam_buka, jam_tutup, is_tutup, id]
    );
    return result;
}