import {v4 as uuid4} from "uuid";
import jwt from "jsonwebtoken";
import {config} from "../../config/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateToken (payload:any= {}){
    const jti = uuid4();
    const token = jwt.sign(
        payload,
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn,
            issuer: config.jwt.issuer,
            algorithm: 'HS512',
            jwtid: jti
        }
    )
    return {
        jti: jti,
        token: token
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifyToken (token:any = null) {
    return new Promise ((resolve,reject) => {
        try {
            const decode = jwt.verify(token,config.jwt.secret);
            resolve(decode)
        } catch(error) {
            reject(error)
        }
    })
}

export {
    generateToken,
    verifyToken
}
