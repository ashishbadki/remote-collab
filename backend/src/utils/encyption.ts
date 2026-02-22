import crypto from 'crypto';
import { buffer } from 'stream/consumers';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CHAT_SECRET_KEY as string;

const key = crypto.createHash('sha256').update(secretKey).digest();

const iv = Buffer.alloc(16, 0); 

export function encryptMessage(message: string){
    const ciper = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = ciper.update(message, 'utf8', 'hex');
    encrypted += ciper.final('hex');
    return encrypted;
}

export function decryptMessage(encryptedMessage: string){
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}