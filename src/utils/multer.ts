import { diskStorage, Options, DiskStorageOptions, FileFilterCallback } from 'multer';
import * as dotenv from 'dotenv';
import { extname, join, normalize } from 'path';
import { BadRequestException } from '@nestjs/common';
import { OptionType } from '../user/interfaces/student.interface';
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
    const fileSize = field === OptionType.AVATAR
                        ? +process.env.AVATAR_MAX_SIZE || 1.5 * 10 ** 6 // 1.5MB
                        : +process.env.VIDEO_MAX_SIZE || 1 * 10 ** 9    // 1GB
    return {
        limits: {
            fileSize: fileSize
        },
        fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            const fileRegEx = field === OptionType.AVATAR 
                                ? /\/(jpg|jpeg|png)$/
                                : /\/(mp4|webm|ogg|avi|mov|flv|mkv|wmv)$/

            if (file.mimetype.match(fileRegEx)) {
                cb(null, true);
            } else {
                cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`));
            }
        },
        storage: diskStorage(storageOptions)
    }
}   
