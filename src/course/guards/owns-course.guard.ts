import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { ExtendedRequest } from "src/user/interfaces/request.interface";
import { CourseService } from "../course.service";
import { Admin } from "typeorm";


@Injectable()
export class OwnsCourseGuard implements CanActivate {
    constructor(private courseService: CourseService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<ExtendedRequest<User>>();
        const courseId = req.params.courseId;
        const courseRepo = this.courseService.getCourseRepo();
        const course = await courseRepo.findOne({
            where: {
                id: courseId
            }
        })
        return req.user.id === course.instructor.id || req.user instanceof Admin;
    }
}