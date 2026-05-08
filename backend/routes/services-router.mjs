import express from 'express';
import {delServ, getServ, postServ, upServ} from "../controller/controller-services.mjs";


const ServRouter = express.Router();

ServRouter.get("/", getServ);
ServRouter.post("/", postServ);
ServRouter.put("/:id", upServ);
ServRouter.delete("/:id", delServ);

export default ServRouter;