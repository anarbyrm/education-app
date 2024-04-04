import { sign as _sign, verify as _verify } from 'jsonwebtoken';
import { promisify } from 'util';
import * as dotenv from 'dotenv'
import { SignFunction, VerifyFunction } from '../user/interfaces/student.interface';

dotenv.config();

const sign: SignFunction = promisify(_sign);
const verify: VerifyFunction = promisify(_verify);
const SECRET = process.env.JWT_SECRET;

export const createToken = async (userId: number, email: string) => {
    const token = await sign({ userId, email }, SECRET);
    return token;
}

export const decodeToken = async (token: string) => {
    const decode = await verify(token, SECRET);
    return decode;
}
