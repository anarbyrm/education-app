import { diskStorage, Options, DiskStorageOptions, FileFilterCallback } from 'multer';
import * as dotenv from 'dotenv';
import { extname, join, normalize } from 'path';
import { BadRequestException } from '@nestjs/common';
import { OptionType } from '../interfaces/student.interface';
import { existsSync, mkdirSync } from 'fs';

dotenv.config();

type Callback = (error: null, path: string) => void;

const setStorageOptions = (destinationPath: string) => {
    return {
        destination: (req: Express.Request, file: Express.Multer.File, cb: Callback) => {
            if (!existsSync(destinationPath)) {
                mkdirSync(destinationPath, { recursive: true });
            }
            cb(null, destinationPath);
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: Callback) => {
            const fileExt = extname(file.originalname);
            const fileName = normalize(file.originalname.split(fileExt)[0]);
            const saveFileName = `${fileName}-${Date.now().toString()}${fileExt}`
            cb(null, saveFileName);
        }
    
    }
}

export const createMulterOptions = (field: OptionType) => {
    const optionType = field === OptionType.AVATAR ? '/avatars' : '/lectures';
    const destionationPath = join('./uploads', optionType)

    const storageOptions = setStorageOptions(destionationPath);

    return {
        limits: {
            fileSize: +process.env.AVATAR_MAX_SIZE || 0
        },
        fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                cb(null, true);
            } else {
                cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`));
            }
        },
        storage: diskStorage(storageOptions)
    }
}   
