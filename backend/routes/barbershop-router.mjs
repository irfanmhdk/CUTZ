import express from "express";
import {
    getAllBarbershops,
    hapusBarbershop,
    inputBarbershop,
    upBarbershop
} from "../controller/controller-barbershop.mjs";

const BarRouter = express.Router();

BarRouter.get('/', getAllBarbershops);
BarRouter.post('/', inputBarbershop);
BarRouter.delete('/:id', hapusBarbershop);
BarRouter.put('/:id', upBarbershop);

export default BarRouter;