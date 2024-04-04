import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Tutor } from "../entities/tutor.entity";
import { Admin } from "../entities/admin.entity";

export class IsTutorOrAdmin implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.user instanceof Tutor || request.user instanceof Admin;
    }
}
