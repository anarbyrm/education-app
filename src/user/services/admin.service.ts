import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "../dto/admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../entities/admin.entity";
import { Repository } from "typeorm";


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>
    ) {}

    fetchAll() {}

    fetchOne(id: number) {}

    create(dto: CreateAdminDto) {}

    update(id: number) {}

    delete(id: number) {}

    createToken() {}

}