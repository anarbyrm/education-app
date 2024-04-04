import { Controller } from "@nestjs/common";
import { TutorService } from "../services/tutor.service";


@Controller()
export class TutorController {
    constructor(private instructorService: TutorService) {}

    fetchAll() {}

    fetchOne() {}

    create() {}

    delete() {}

    update() {}
}