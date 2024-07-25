/* eslint-disable @typescript-eslint/no-explicit-any */
import {InfoCode,ClientErrorCodes,RedirectionCodes,ServerErrorsCodes,SuccessCodes} from "./httpcodes";

export interface IResponseBody<T=any> {
data?:T,
message:string,
cookie?:any,
errors?:any,
sessionExpired?:boolean
}

export interface IReqestBody<T=any>{
    auth: {
        _id: string,
        sessionID: string,
        name: string,
        mobileNo: string,
        email: string,
        role: string
    },
    file:T
}

export class AppError extends Error {
    status:InfoCode|ClientErrorCodes|RedirectionCodes|ServerErrorsCodes|SuccessCodes;
    constructor(message:any|string,status:InfoCode|ClientErrorCodes|RedirectionCodes|ServerErrorsCodes|SuccessCodes) {
        super(message)
        this.status=status
    }
}