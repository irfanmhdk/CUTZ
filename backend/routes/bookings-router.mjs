import express from "express";
import multer from "multer";
import path from "path";
import {getBook, getCekBook, getMyBook, inBook, upBook} from "../controller/controller-bookings.mjs";

const Book = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/upload'); // Pastikan folder ini sudah ada
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// 2. Filter Format File
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung! Gunakan JPG/PNG.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

Book.get('/', getBook);
Book.get('/', getCekBook);
Book.get('/:id', getMyBook);
Book.post('/', upload.single('bukti'), inBook);
Book.put('/:id', upBook);

export default Book;