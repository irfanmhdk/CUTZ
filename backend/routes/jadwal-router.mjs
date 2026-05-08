import express from 'express';
import {getAllJadwal, getJadwalHari, hapusJadwal, inputJadwal, ubahJadwal} from "../controller/controller-jadwal.mjs";

const jadwalRouter = express.Router();

jadwalRouter.get("/", getAllJadwal);
jadwalRouter.get("/:hari", getJadwalHari);
jadwalRouter.post("/", inputJadwal);
jadwalRouter.delete("/:id", hapusJadwal);
jadwalRouter.put("/:id", ubahJadwal);

export default jadwalRouter;