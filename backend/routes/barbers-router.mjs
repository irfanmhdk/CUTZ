import express from "express";
import {getAllKaps, hapusBarbers, upKaps} from "../controller/controller-barbers.mjs";

const KapsRouter = express.Router();

KapsRouter.get('/', getAllKaps);
KapsRouter.delete('/:id', hapusBarbers);
KapsRouter.put('/:id', upKaps);

export default KapsRouter;