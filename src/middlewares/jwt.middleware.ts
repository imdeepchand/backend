import { NextFunction, Response } from "express";
import { AppError, IResponseBody } from "../types/type";
import { verifyToken } from "../helpers/jwt.helper";
import { ClientErrorCodes } from "../types/httpcodes";
import { HandleAllErrors } from "../helpers/error.helper";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jwtMiddleware(req: any, res: Response<IResponseBody>, next: NextFunction) {
    // eslint-disable-next-line prefer-const
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token) {
            let authToken = "Bearer " + token;
            if (authToken) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isJwt = authToken.includes('Bearer ');
                if (isJwt) {
                    const token = authToken.replace('Bearer ', '');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    verifyToken(token).then(async (result: any) => {
                        req.auth = result['data'];
                        next();
                    }).catch(err => {
                        res.status(ClientErrorCodes.Unauthorized).json({
                            sessionExpired: true,
                            message: err.message
                        });
                    });
                } else {
                    res.status(ClientErrorCodes.NotFound).json({
                        message: "Token not found"
                    });
                }
            } else {
                res.status(ClientErrorCodes.Unauthorized).json({
                    message: "Unauthorized access"
                });
            }
        } else {
            throw new AppError("Not found!", ClientErrorCodes.BadRequest)
        }
    } catch (error) {
        HandleAllErrors(error, { res });
    }
}

export {
    jwtMiddleware
}