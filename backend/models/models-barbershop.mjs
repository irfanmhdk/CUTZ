import db from '../config/db.mjs';

// 1. Semua Data Barbershop dan Search
export  const getAllBars = async (s = '') => {
    const [rows] = await db.promise().query('SELECT * FROM VBarbershop WHERE Barbershop LIKE ? OR Owner LIKE ? OR Alamat LIKE ?',
        [`%${s}%`,`%${s}%`,`%${s}%`]);
    return rows;
}

// 2. Input Barbershop
export const createBarbershop = async (data) => {
    const { Users_id, Nama, Alamat, Hp } = data;
    const [result] = await db.promise().query(
        'INSERT INTO barbershop (Users_id, Nama, Alamat, Hp) VALUES (?, ?, ?, ?)',
        [Users_id, Nama, Alamat, Hp]
    );
    return result;
}

// 3. Hapus Barbershop
export const hapusBarbershop = async (id) => {
    const [result] = await db.promise().query('DELETE FROM barbershop WHERE Barbershop_id = ?', [id]);
    return result;
}

export const updateBarbershop = async (data, id) => {
    const { Users_id, Nama, Alamat, Hp } = data;
    const [result] = await db.promise().query('UPDATE barbershop SET Users_id = ?, Nama = ?, Alamat = ?, Hp = ? WHERE Barbershop_id = ?',
        [Users_id, Nama, Alamat, Hp, id]
    );
    return result;
}