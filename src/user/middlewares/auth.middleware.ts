import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Response, NextFunction } from 'express';
import { UserService } from "../services/user.service";
import { decodeToken } from "../../utils/jwt.util";
import { ExtendedRequest } from "../interfaces/request.interface";
import { User } from "../entities/user.entity";


@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
    constructor(private userService: UserService) {}

    async use(req: ExtendedRequest<User>, res: Response, next: NextFunction) {
        if (req.headers?.authorization) {
            const auth = req.headers.authorization;
            const [prefix, token] = auth.split(' ');

            if (prefix === 'Bearer' && token) {
                const { userId } = await decodeToken(token);
                const user = await this.userService.findOne(parseInt(userId));
                if (user.isActive !== true) throw new UnauthorizedException('Not authorized');
                req.user = user;
            }
        }

        next();
    }
}