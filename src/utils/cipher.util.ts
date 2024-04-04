import * as crypto from 'crypto';

const secret = Buffer.alloc(32);
secret.write(process.env.SECRET || "", 'utf8');

const vector = Buffer.alloc(16);
vector.write(process.env.VECTOR || "", 'utf8');


export function createCipher(paylaod: object) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, vector);
    let encrypted = cipher.update(JSON.stringify(paylaod), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}


export function decipher(cipher: string) {
    const deciphered = crypto.createDecipheriv("aes-256-cbc", secret, vector);
    let decryptedToken = deciphered.update(cipher, "hex", "utf-8");
    decryptedToken += deciphered.final("utf-8");
    return decryptedToken;
}