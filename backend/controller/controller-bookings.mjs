import * as Book from '../models/models-bookings.mjs';

export const getBook = async (req, res) => {
    try{
        const { q } = req.query;
        const data = await Book.getBook(q);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

export const getCekBook = async (res) => {
    try{
        const data = await Book.getCekBook();

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

export const getMyBook = async (req, res) => {
    try{
        const { id } = req.params;
        const { role } = req.query;

        const data = await Book.getMyBook(id, role);

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message });
    }
}

export const inBook = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ pesan: 'Gagal! Bukti transfer wajib diunggah (JPG/PNG).' });
        }

        const dataPayload = {
            ...req.body,
            bukti: req.file.filename
        };

        const result = await Book.postBook(dataPayload);
        res.status(201).json({ pesan: 'Bookings berhasil!', id: result.insertId });

    } catch (error) {
        res.status(500).json({ pesan: 'Gagal bookings', error: error.message });
    }
}

export const upBook = async (req, res) => {
    try {
        const result = await Book.updBook(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Data tidak ditemukan!' });
        }

        res.status(201).json({ pesan: 'Data berhasil diperbarui di database' });
    } catch (error) {
        res.status(500).json({ pesan: 'Gagal update data', error });
    }
}