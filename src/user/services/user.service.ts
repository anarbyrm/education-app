import * as crypto from 'crypto';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { decipher } from '../utils/cipher.util';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findOne(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        if (!user) throw new NotFoundException('no such user with specified email.');
        return user;
    }

    async verifyTokenAndActivateUser(token: string) {
        const payloadString = decipher(token);
        const { email } = JSON.parse(payloadString);
        const user = await this.userRepository.findOne({ where: { email }});
        user.isActive = true;
        return this.userRepository.save(user);
    }
}
