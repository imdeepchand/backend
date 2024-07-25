import { Router } from "express";
import UsersController from "../controllers/users.controller"
export const user_router = Router();

user_router.post("/user/register",UsersController.register)
user_router.post("/user/login", UsersController.login)