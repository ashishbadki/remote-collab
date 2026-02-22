import jwt from 'jsonwebtoken';

export const verifySocketToken = (token: string) =>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded;
    }
    catch (error){
        console.error("WebSocket token verification failed:", error);
        return null;
    }
}