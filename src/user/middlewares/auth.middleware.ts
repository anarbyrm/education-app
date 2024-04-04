import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from 'express';
import { UserService } from "../services/user.service";
import { decodeToken } from "../utils/jwt.util";
import { ExtendedRequest } from "../interfaces/request.interface";


@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
    constructor(private userService: UserService) {}

    async use(req: ExtendedRequest, res: Response, next: NextFunction) {
        if (req.headers?.authorization) {
            const auth = req.headers.authorization;
            const [prefix, token] = auth.split(' ');
            console.log(token)
            if (prefix === 'Bearer' && token) {
                const { userId } = await decodeToken(token);
                const user = await this.userService.findOne(parseInt(userId));
                req.user = user;
            }
        }

        next();
    }
}