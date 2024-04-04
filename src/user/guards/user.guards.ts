import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ExtendedRequest } from "../interfaces/request.interface";
import { UserService } from "../services/user.service";
import { Admin } from "../entities/admin.entity";

/**
 * Checks if user logged in
 */
export class LogInGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.user;
    }
}

/**
 * Checks if user is admin or owns the user entity requested
 */
export class IsAdminOrOwnsEntityGuard implements CanActivate {
    constructor(private userService: UserService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<ExtendedRequest>();
        const { id } = request.params;
        const user = await this.userService.findOne(parseInt(id));
        return user instanceof Admin || user.id === request.user.id;
    }
}