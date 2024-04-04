import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";


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
}
