import db from "../config/db.mjs";

export const allKaps = async (s = '') => {
    const [rows] = await db.promise().query('SELECT * FROM VKapster WHERE Kapster LIKE ? OR Barbershop LIKE ?',
        [`%${s}%`,`%${s}%`]
    );
    return rows;
}

export const hapusBarbers = async (id) => {
    const [rows] = await db.promise().query('DELETE FROM barbers WHERE Barbers_id = ?', [id]);
    return rows;
}

export const upKaps = async (data, id) => {
    const { Barbershop, Pendapatan, Status } = data;
    const [result] = await db.promise().query('UPDATE barbers SET Barbershop_id = ?, Pendapatan = ?, Status = ? WHERE Barbers_id = ?',
        [Barbershop, Pendapatan, Status, id]);
    return result;
}