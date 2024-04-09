import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { CourseService } from "../course.service";
import { Admin } from "src/user/entities/admin.entity";


@Injectable()
export class HasPaidGuard implements CanActivate {
    constructor(private courseService: CourseService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const courseId = req.params.courseId as string;
        const courseRepo = this.courseService.getCourseRepo();
        const course = await courseRepo.findOne({
            where: {
                id: courseId
            },
            relations: {
                students: true,
                instructor: true
            }
        })
        if (!course) throw new NotFoundException('Course with specified id not found!');
        // check if current user is student and has paid
        // or tutor  and owns the course
        // or it is admin user
        return course.students.includes(req.user) 
                || course.instructor.id === req.user.id 
                || req.user instanceof Admin;
    }
}
