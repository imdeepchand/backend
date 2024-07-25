import { Router } from "express";
import BlogController from "../controllers/blog.controllers";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
export const blog_router = Router();

blog_router.post('/blog/create', jwtMiddleware,BlogController.createBlog);
blog_router.post('/blog/update',jwtMiddleware, BlogController.editBlog);
blog_router.post('/blog/list',jwtMiddleware, BlogController.listBlog);
blog_router.post('/blog/lock',jwtMiddleware, BlogController.setLock);
blog_router.get('/blog',jwtMiddleware, BlogController.blogById);