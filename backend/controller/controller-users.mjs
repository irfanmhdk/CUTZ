import * as Users from "../models/models-users.mjs";

// ----- USERS -----
// 1. Ambil Semua Data Users
export const getAllUsers = async (req, res) => {
    try{
        const { q } = req.query;
        const data = await Users.allUsers(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengammbil data', error: error.message });
    }
}

// 2. Input Data User
export const inputUser = async (req, res) => {
    try {
        if (!req.body.Nama || !req.body.Email || !req.body.Role || !req.body.Pw) return res.status(400).json({ pesan: 'Semua data wajib diisi!' });

        const result = await Users.createUser(req.body);
        res.status(201).json({
            pesan: 'Data user berhasil diubah',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal membuat akun', error: error.message });
    }
}

// 3. Hapus Data User
export const hapusUser = async (req, res) => {
    try {
        const result = await Users.hapusUser(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Data user tidak ditemukan' })
        }

        res.status(200).json({ pesan: 'Data user berhasil dihapus'});
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal menghapus data user' });
    }
}

// 4    . Ubah Data User
export const ubahUser = async (req, res) => {
    try {
        const result = await Users.upUser(req.body, req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ pesan: 'User tidak ditemukan' });
        }

        res.status(200).json({ pesan: 'Data user berhasil diubah' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal merubah data user' });
    }
}
// ----- END USERS -----