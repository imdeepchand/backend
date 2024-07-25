import { Router } from "express";
import {uploadImg} from "../middlewares/upload.middleware";
import UploadController from "../controllers/upload.controller";
export const upload_router = Router();

upload_router.post('/upload',uploadImg, UploadController.upload)