import { 
    Body, 
    Controller, 
    Get, 
    HttpCode,
    HttpStatus, 
    Post, 
    Query, 
    Req, 
    UseGuards 
} from "@nestjs/common";
import { ExtendedRequest } from "../interfaces/request.interface";
import { UserService } from "../services/user.service";
import { UserTokenDto } from "../dto/user.dto";
import { User } from "../entities/user.entity";
import { LogInGuard } from "../guards/user.guards";


@Controller('/users')
export class UserContoller {
    constructor(private userService: UserService) {}

    @Get('/current')
    @UseGuards(LogInGuard)
    currentUser(@Req() request: ExtendedRequest<User>) {
        return request.user
    }

    @Get('/account/activate')
    activateAccount(@Query('token') token: string) {
        return this.userService.verifyTokenAndActivateUser(token);
    }

    @Post('/auth/token')
    @HttpCode(HttpStatus.OK)
    async getToken(@Body() dto: UserTokenDto) {
        return this.userService.getToken(dto);
    }
}
