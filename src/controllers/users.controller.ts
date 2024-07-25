import { Request, Response } from "express"
import z from "zod";
import { ObjectId } from "mongodb";
import { AppError } from "../types/type"
import { HandleAllErrors } from "../helpers/error.helper";
import { ServerErrorsCodes, SuccessCodes,ClientErrorCodes } from "../types/httpcodes";
import { UserCollection } from "../collections/users.collection";
import { comparePassword, hashPassword } from "../helpers/hasher.helper";
import { generateToken } from "../helpers/jwt.helper";
class UsersController {
    static async register(req: Request, res: Response) {
            try {              
              const user = (req as any).auth;              
              const body =  z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(6),
                createdAt: z.date().default(new Date())
              }).parse(req.body);
              const newUser = {
                ...body,
                password: hashPassword(body.password),
              };
              const result = await UserCollection()?.insertOne(newUser);
              if (!result) throw new AppError('Insert data failed!', ServerErrorsCodes.InternalServerError);
              res.status(SuccessCodes.Created).json({
                data: result,
                message: 'Successfully registered!'
              });
            } catch (error) {
              HandleAllErrors(error, { res });
            }        
    }
    static async login (req: Request, res: Response) {
        try {
            const loginData = z.object({
                username: z.string(),
                password: z.string()
            }).parse(req.body);
            
            const user = await UserCollection()?.findOne({ email: loginData.username });
            if (!user) throw new AppError("Username or password doesn't match!", ClientErrorCodes.BadRequest);
            const checkPassword = user.password.split(':');
            const match = comparePassword(loginData.password, checkPassword[1], checkPassword[0]);
            if (match) {
              const token = generateToken({
                data: { ...user, password: undefined }
              })
              
              const resData = {
                user: { ...user, password: undefined },
                token:token.token,
                login: true
              };
              await UserCollection()?.updateOne(
                { _id: new ObjectId(user._id) },
                { $set: { lastLogin: new Date() } }
              );
              res.status(SuccessCodes.Ok).json({
                message: 'Logged in success!',
                data: resData
              });
            } else {
              throw new AppError("Username or password doesn't match!", ClientErrorCodes.BadRequest);
            }
          } catch (error) {
            HandleAllErrors(error, { res });
          }
      
    }
}

export default UsersController;