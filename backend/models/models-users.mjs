import db from '../config/db.mjs';
import bcrypt from 'bcrypt';

export const allUsers = async (s = '') => {
    const [rows] = await  db.promise().query('SELECT * FROM users WHERE Nama LIKE ? OR Email LIKE ? OR Role LIKE ?',
        [`%${s}%`,`%${s}%`,`%${s}%`]);
    return rows;
};

export const createUser = async (data) => {
    const { Nama, Email, Role, Pw } = data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Pw, saltRounds);

    const [result] = await db.promise().query('INSERT INTO users (Nama, Email, Password, Role) VALUES (?, ?, ?, ?)',
        [Nama, Email, hashedPassword, Role]);

    const newUserId = result.insertId;

    if (Role === 'Barber') {
        // Kita set pendapatan awal 0.00 dan status default 'Aktif'
        await db.promise().query(
            'INSERT INTO barbers (Users_id, Barbershop_id, Pendapatan) VALUES (?, ?, ?)',
            [newUserId, 1, 0.00]
        );
    }

    return result;
}

export const hapusUser = async (id) => {
    const [result] = await db.promise().query('DELETE FROM users WHERE Users_id = ?', [id]);
    return result;
}

export const upUser = async (data, id) => {
    const { Nama, Email, Role, Pw, Bar } = data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Pw, saltRounds);

    const [result] = await db.promise().query('UPDATE users SET Nama = ?, Email = ?, Password = ?, Role = ? WHERE Users_id = ?',
        [Nama, Email, hashedPassword, Role, id]);

    if (Role === 'Barber') {
        const [rows] = await db.promise().query('SELECT * FROM barbers WHERE Users_id = ?', [id]);

        if (rows.length > 0) {
            await db.promise().query('UPDATE barbers SET Barbershop_id = ? WHERE Users_id = ?', [Bar, id]);
        } else {
            await db.promise().query(
                `INSERT INTO barbers (Users_id, Barbershop_id, Pendapatan, Status)
                 VALUES (?, ?, 0.00, 'Aktif')
                     ON DUPLICATE KEY UPDATE Barbershop_id = ?`,
                [id, Bar, Bar]
            );
        }
    } else {
        await db.promise().query('DELETE FROM barbers WHERE Users_id = ?', [id]);
    }

    return result;
}

export const getUserByEmail = async (email) => {
    const [rows] = await db.promise().query('SELECT users.*, barbers.Barbers_id, barbers.Status FROM users LEFT JOIN barbers ON users.Users_id = barbers.Users_id WHERE users.Email = ?', [email]);
    return rows[0];
};