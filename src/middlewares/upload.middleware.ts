import { Request } from "express";
import multer from 'multer';
import path from 'path';
import { ObjectId } from "mongodb";
const uploadPath = './public/image';
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req:Request, file:any, cd:any) {
        cd(null, new ObjectId() + 'image' + path.extname(file.originalname))
    }
})

const validator =  (req:Request, file:any, cd:any) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
        cd(null, true)
    } else {
        cd(null, false)
    }
}

export const uploadImg = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }, fileFilter: validator
}).single('image');