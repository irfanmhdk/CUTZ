import * as JadwalModel from '../models/models-jadwal.mjs';

export const getAllJadwal = async (req, res) => {
    try {
        const { q } = req.query;
        const data = await JadwalModel.fetchAllJadwal(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

export const getJadwalHari = async (req, res) => {
    try {
        const { hari } = req.query;
        const data = await JadwalModel.fetchJadwalByHari(hari);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

// 2. Input Jadwal
export const inputJadwal = async (req, res) => {
    try {
        if (!req.body.hari) return res.status(400).json({ pesan: 'Hari wajib diisi!' });

        const result = await JadwalModel.createJadwal(req.body);
        res.status(201).json({
            pesan: 'Jadwal berhasil disimpan ke database.',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal simpan data', error: error.message });
    }
}

// 3. Hapus Jadwal
export const hapusJadwal = async (req, res) => {
    try {
        const result = await JadwalModel.hapusJadwal(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Jadwal tidak ditemukan!' });
        }
        res.status(200).json({ pesan: 'Jadwal berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal menghapus data' });
    }
}

// 4. Ubah Jadwal
export const ubahJadwal = async (req, res) => {
    try {
        const result = await JadwalModel.ubahJadwal(req.body, req.params.id)

        if (result.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Jadwal tidak ditemukan!' });
        }

        res.status(200).json({ pesan: 'Jadwal berhasil diperbarui di database' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal update data', error });
    }
}
// ----- END JADWAL -----