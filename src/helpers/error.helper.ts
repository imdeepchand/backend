import { Response } from "express";
import { ZodError } from "zod";
import { ClientErrorCodes, ServerErrorsCodes } from "../types/httpcodes";
import { fromZodError } from "zod-validation-error";
import { AppError, IResponseBody } from "../types/type";
export function HandleAllErrors(error: unknown, options: { res?: Response<IResponseBody> }) {
    console.log("from errors helper",{error});
    if (error instanceof ZodError) {
        const errs = fromZodError(error)
        console.log({
            message: "Validation Error",
            errors: errs.message
        });
        if (options.res) return options.res.status(ClientErrorCodes.BadRequest).json({
            message: errs.message
        });
    }
    else if (error instanceof AppError) {
        if (options.res) return options.res.status(error.status).json({
            message: error.message
        });
    } else {
        if (options.res) return options.res.status(ServerErrorsCodes.InternalServerError).json({
            message: "Internal server error"
        });
    }
}