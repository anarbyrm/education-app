import { hash, compare } from 'bcrypt';


export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await hash(password, saltRounds);
}

export const checkPassword = async (password: string, hashedPassword: string) => {
    return await compare(password, hashedPassword);
}
