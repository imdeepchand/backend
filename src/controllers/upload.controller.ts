import { Request, Response } from "express";
import { ServerErrorsCodes, SuccessCodes } from "../types/httpcodes";
import { AppError } from "../types/type";
import { HandleAllErrors } from "../helpers/error.helper";
class UploadController {
    static async upload(req: Request, res: Response) {
        try {
            const file = req.file;
            if(!file) throw new AppError("Failed to upload",ServerErrorsCodes.InternalServerError)
            res.status(SuccessCodes.Ok).json({
                message: 'Logged in success!',
                data: {
                    path: `public/image/${file.filename}`
                }
              });
        } catch (error) {
            HandleAllErrors(error,{res})
        }
    }
}

export default UploadController;