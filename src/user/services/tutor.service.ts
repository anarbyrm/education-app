import { unlink } from "fs/promises";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tutor } from "../entities/tutor.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { IUserFilterQuery } from "../interfaces/user.interface";
import { buildQuery } from "../user.helper";
import { hashPassword } from "../utils/password.util";


@Injectable()
export class TutorService {
    constructor(
        @InjectRepository(Tutor)
        private tutorRepository: Repository<Tutor>
    ) {}

    async findAll(query: IUserFilterQuery, limit: number = 10, offset: number = 0) {
        let qb = this.tutorRepository.createQueryBuilder();
        qb = buildQuery<Tutor>(qb, query);
        // pagination
        qb = qb.limit(limit).offset(offset);
        const [tutors, total] = await qb.getManyAndCount();
        return { total, count: tutors.length, limit, offset, tutors };
    }

    async findOne(id: number) {
        const tutor = await this.tutorRepository.findOne({ where: { id } });
        if (!tutor) throw new NotFoundException('Tutor with specified id cannot be found.');
        return tutor;
    }

    async create(dto: CreateUserDto) {
        const password = await hashPassword(dto.password);
        const tutor = this.tutorRepository.create({ ...dto, password });
        return this.tutorRepository.save(tutor);
    }

    async update(id: number, dto: UpdateUserDto) {
        const tutor = await this.findOne(id);
        return this.tutorRepository.save(tutor);
    }

    delete(id: number) {
        return this.tutorRepository.delete(id);
    }

    async updatePhoto(id: number, image: Express.Multer.File) {
        try {
            const tutor = await this.findOne(id);
            const oldPhoto = tutor.photo;
            tutor.photo = image.path;

            const updatedTutor = await this.tutorRepository.save(tutor);
            if (oldPhoto) unlink(oldPhoto);
            return updatedTutor;
        } catch (err) {
            // delete uploaded photo after error;
            await unlink(image.path);
            throw err;
        }

    }

    async removePhoto(id: number) {
        const tutor = await this.findOne(id);
        const photoToBeRemoved = tutor.photo;

        try {
            await unlink(photoToBeRemoved);
            tutor.photo = null;
        } catch (err) {
            console.log((err as Error).message);
        }

        return this.tutorRepository.save(tutor);
    }
}