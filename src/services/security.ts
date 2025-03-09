import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET } from '@/config';

export const generateToken = (payload: any, duration: number): string => {
    const token = jwt.sign(payload, SECRET, { expiresIn: duration });
    return token;
};

export const verifyToken = (token: string): any => {
    try {
        const payload = jwt.verify(token, SECRET);
        return payload;
    } catch (error) {
        return null;
    }
};

export const encryptPassword = async (plainPassword: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(plainPassword, SECRET);
    return hashedPassword;
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
};
