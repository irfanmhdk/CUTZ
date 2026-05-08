import express from "express";
import {getAllUsers, hapusUser, inputUser, ubahUser} from "../controller/controller-users.mjs";
import {login, register} from "../controller/controller-auth.mjs";

const UsersRouter = express.Router();

UsersRouter.get('/', getAllUsers);
UsersRouter.post('/', inputUser);
UsersRouter.delete('/:id', hapusUser);
UsersRouter.put('/:id', ubahUser);

UsersRouter.post('/login', login);
UsersRouter.post('/register', register);

export default UsersRouter;