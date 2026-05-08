import bcrypt from 'bcrypt';
import { getUserByEmail, createUser } from '../models/models-users.mjs';

export const register = async (req, res) => {
    try {
        const { Nama, Email, Password } = req.body;

        const userExists = await getUserByEmail(Email);
        if (userExists) return res.status(400).json({ pesan: "Email sudah digunakan!" });

        await createUser({
            Nama: Nama,
            Email: Email,
            Pw: Password,
            Role: 'Customer'
        });

        res.status(201).json({ pesan: "Registrasi berhasil! Silahkan login." });
    } catch (error) {
        res.status(500).json({ pesan: "Gagal registrasi", error: error.message });
    }
};

export const login = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await getUserByEmail(Email);
        if (!user) return res.status(404).json({ pesan: "Email tidak ditemukan!" });

        const match = await bcrypt.compare(Password, user.Password);
        if (!match) return res.status(400).json({ pesan: "Password salah!" });

        res.status(200).json({
            pesan: "Login berhasil!",
            user: {
                Users_id: user.Users_id,
                Nama: user.Nama,
                Email: user.Email,
                Role: user.Role,
                Barbers_id: user.Barbers_id,
                Status: user.Status
            }
        });
    } catch (error) {
        res.status(500).json({ pesan: "Server Error", error: error.message });
    }
};