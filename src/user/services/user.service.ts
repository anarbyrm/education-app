import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { decipher } from '../../utils/cipher.util';
import { UserTokenDto } from '../dto/user.dto';
import { checkPassword } from '../../utils/password.util';
import { createToken } from '../../utils/jwt.util';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findOne(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        if (!user) throw new NotFoundException('no such user with specified id.');
        return user;
    }
    
    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }});
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

    async getToken(dto: UserTokenDto) {
        const { email, password } = dto; 
        // check if user with specified email exists
        const student = await this.findByEmail(email);
        if (!student) throw new BadRequestException("Email or password is wrong");
        // check if password correct
        if (!await checkPassword(password, student.password))
            throw new BadRequestException("Email or password is wrong");
        
        if (!student.isActive) 
            throw new BadRequestException("Your account is not activated.");

        const token = await createToken(student.id, email);
        return { token }
    }
}
