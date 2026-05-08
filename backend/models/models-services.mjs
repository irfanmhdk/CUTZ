import db from "../config/db.mjs";

export const getServices = async (s = '') => {
    const [rows] = await db.promise().query('SELECT * FROM VServis WHERE Barbershop LIKE ? OR Layanan LIKE ? OR Harga LIKE ?',
        [`%${s}%`,`%${s}%`, `%${s}%`]);
    return rows;
}

export const inputServ = async (data) => {
    const { Bar, Serv, Harga, Dur } = data;
    const [result] = await db.promise().query('INSERT INTO services (Barbershop_id, Nama_jasa, harga, Estimasi) VALUES (?, ?, ?, ?)',
    [Bar, Serv, Harga, Dur]);
    return result;
}

export const putServ = async (data, id) => {
    const { Bar, Serv, Harga, Dur } = data;
    const [result] = await db.promise().query('UPDATE services SET Barbershop_id = ?, Nama_jasa = ?, harga = ?, Estimasi = ? WHERE Services_id = ?',
        [Bar, Serv, Harga, Dur, id]);
    return result;
}

export const deleteServ = async (id) => {
    const [result] = await db.promise().query('DELETE FROM services WHERE Services_id = ?', [id]);
    return result;
}