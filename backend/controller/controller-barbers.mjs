import * as KapsMod from "../models/models-barbers.mjs";

// 1. Ambil Semua Data & Search
export const getAllKaps = async (req, res) => {
    try {
        const { q } = req.query;
        const data = await KapsMod.allKaps(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

// 2. Hapus Data
export const hapusBarbers = async (req, res) => {
    try {
        const result = await KapsMod.hapusBarbers(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Data tidak ditemukan' })
        }
        res.status(200).json({ pesan: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
}

// 3. Ubah Data
export const upKaps = async (req, res) => {
    try {
        if (!req.body.Barbershop || !req.body.Pendapatan || !req.body.Status) return res.status(400).json({ pesan: 'Semua data wajib diisi!' });

        const result = await KapsMod.upKaps(req.body, req.params.id);
        res.status(201).json({
            pesan: 'Data berhasil diubah',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal membuat akun', error: error.message });
    }
}