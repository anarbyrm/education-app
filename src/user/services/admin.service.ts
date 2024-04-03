import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminDto } from "../dto/admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../entities/admin.entity";
import { Repository } from "typeorm";
import { checkPassword, hashPassword } from "../utils/password.util";
import { UserTokenDto } from "../dto/user.dto";
import { createToken } from "../utils/jwt.util";


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>
    ) {}

    async fetchAll() {
        const [admins, total] = await this.adminRepository.findAndCount();
        return { total, admins };
    }

    async fetchOne(id: number) {
        const admin = await this.adminRepository.findOne({ where: { id }});
        if (!admin) throw new NotFoundException("No such admin user with given id.");
        return admin;
    }

    async create(dto: CreateAdminDto) {
        const admin = this.adminRepository.create({
            email: dto.email,
            password: await hashPassword(dto.password),
            role: dto.role
        })
        // admin accounts should be active
        admin.isActive = true
        return this.adminRepository.save(admin);
    }

    update(id: number) {}

    async delete(id: number) {
        const admin = await this.fetchOne(id);
        return this.adminRepository.delete(admin.id);
    }

    async createToken(dto: UserTokenDto) {
        const [admin] = await this.adminRepository.find({ where: { email: dto.email }});

        const notFoundError = new NotFoundException("Email or password is wrong.")
        if (!admin) throw notFoundError;
        if (!checkPassword(dto.password, admin.password)) throw notFoundError;

        return createToken(admin.id, admin.email);
    }

}