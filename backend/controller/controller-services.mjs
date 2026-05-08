import * as Serv from '../models/models-services.mjs';
import * as Users from "../models/models-users.mjs";

export const getServ = async (req, res) => {
    try {
        const {q} = req.query;
        const data = await Serv.getServices(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

export const postServ = async (req, res) => {
    try {
        if (!req.body.Bar || !req.body.Serv || !req.body.Harga || !req.body.Dur) return res.status(400).json({ pesan: 'Semua data wajib diisi!' });

        const result = await Serv.inputServ(req.body);
        res.status(201).json({
            pesan: 'Data berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal menambahkan data', error: error.message });
    }
}

export const upServ = async (req, res) => {
    try {
        const result = await Serv.putServ(req.body, req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ pesan: 'Data tidak ditemukan' });
        }

        res.status(200).json({ pesan: 'Data berhasil diubah' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal merubah data' });
    }
}

export const delServ = async (req, res) => {
    try {
        const result = await Serv.deleteServ(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).json({ pesan: 'Data tidak ditemukan' });
        }

        res.status(200).json({ pesan: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal menghapus data' });
    }
}