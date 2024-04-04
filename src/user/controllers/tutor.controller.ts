import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { TutorService } from "../services/tutor.service";


@Controller('/users/tutors')
export class TutorController {
    constructor(private instructorService: TutorService) {}

    @Get()
    fetchAll() {}

    @Get()
    fetchOne() {}

    @Post()
    create() {}

    @Delete()
    delete() {}

    @Patch()
    updateInfo() {}

    @Patch()
    updatePhoto() {}

    @Delete()
    removePhoto() {}
}