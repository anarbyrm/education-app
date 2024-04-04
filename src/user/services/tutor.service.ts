import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tutor } from "../entities/tutor.entity";
import { Repository } from "typeorm";

@Injectable()
export class TutorService {
    constructor(
        @InjectRepository(Tutor)
        private tutorRepository: Repository<Tutor>
    ) {}

    findAll() {}

    findOne() {}

    create() {}

    update() {}

    delete() {}
}