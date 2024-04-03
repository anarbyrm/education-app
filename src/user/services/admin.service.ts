import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminDto } from "../dto/admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../entities/admin.entity";
import { Repository } from "typeorm";
import { hashPassword } from "../utils/password.util";


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

    delete(id: number) {}

    createToken() {}

}