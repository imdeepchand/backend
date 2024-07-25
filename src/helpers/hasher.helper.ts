import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from "crypto";
import { BYTES, ITERATION, KEY_LENGTH, DIGEST, ENCRYPTION_KEY, ALGORITHM } from "../../config/global";

export function hashPassword(password: string) {
    const salt = randomBytes(BYTES).toString('hex');
    const hash = pbkdf2Sync(password, salt, ITERATION, KEY_LENGTH, DIGEST).toString('hex');

    return `${salt}:${hash}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyPassword(plain_password: any, hash_password: any, salt: any): Promise<boolean> {
    const hash = pbkdf2Sync(plain_password, salt, ITERATION, KEY_LENGTH, DIGEST).toString('hex');
    if (hash === hash_password) {
        return true;
    } else {
        return false;
    }
}

export function comparePassword(plain_password: string, hash_password: string, salt: string): boolean {
    const hash = pbkdf2Sync(plain_password, salt, ITERATION, KEY_LENGTH, DIGEST).toString('hex');
    return hash === hash_password;
}

export function generateSecretKey() {
    return randomBytes(BYTES).toString('hex');
}

export function encryptor(text: string) {
    const iv:any = randomBytes(16);
    let cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted:any = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return [
        iv,
        encrypted
    ];
}

export function decryptor(text: {
    iv: string,encryptedData:string
}) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export function decription(encryptedData: any[]) {
    let iv = Buffer.from(encryptedData[0]).toString('hex');
    let encryptData = Buffer.from(encryptedData[1]).toString('hex');
    const decryptedData = decryptor({ encryptedData: encryptData, iv: iv });
    return JSON.parse(decryptedData);
}