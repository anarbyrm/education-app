import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Admin } from "../entities/admin.entity";


@Injectable()
export class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.user && request.user instanceof Admin;
    }
} 