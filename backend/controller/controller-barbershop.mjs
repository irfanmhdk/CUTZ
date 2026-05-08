import * as BarModel from "../models/models-barbershop.mjs";

// ----- BARBERSHOP -----
// 1. Ambil Semua Data Barbershop
export const getAllBarbershops = async (req, res) => {
    try {
        const { q } = req.query;
        const data = await BarModel.getAllBars(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

// 2. Input Data Barbershop
export const inputBarbershop = async (req, res) => {
    try {
        if (!req.body.Users_id || !req.body.Nama || !req.body.Alamat || !req.body.Hp) return res.status(400).json({ pesan: 'Semua data wajib diisi!' });

        const result = await BarModel.createBarbershop(req.body);
        res.status(201).json({
            pesan: 'Data berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal simpen data', error: error.message });
        console.log(req.body.Users_id);
    }
}

// 3. Hapus Data Barbershop
export const hapusBarbershop = async (req, res) => {
    try{
        const result = await BarModel.hapusBarbershop(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barbershop tidak ditemukan' })
        }
        res.status(200).json({ pesan: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
}

// 4. Ubah Data Barbershop
export const upBarbershop = async (req, res) => {
    try {
        const result = await BarModel.updateBarbershop(req.body, req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barbershop tidak ditemukan' })
        }
        res.status(200).json({ pesan: 'Data berhasil diubah' });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
}
// ----- END BARBERSHOP -----