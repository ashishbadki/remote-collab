import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0);

function getKey(): Buffer {
    const secretKey = process.env.CHAT_SECRET_KEY;
    if (!secretKey) throw new Error('CHAT_SECRET_KEY is not set in environment');
    return crypto.createHash('sha256').update(secretKey).digest();
}

export function encryptMessage(message: string) {
    const ciper = crypto.createCipheriv(algorithm, getKey(), iv);
    let encrypted = ciper.update(message, 'utf8', 'hex');
    encrypted += ciper.final('hex');
    return encrypted;
}

export function decryptMessage(encryptedMessage: string) {
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}