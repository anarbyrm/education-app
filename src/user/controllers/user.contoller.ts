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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtendedRequest } from "../interfaces/request.interface";
import { UserService } from "../services/user.service";
import { UserTokenDto } from "../dto/user.dto";
import { User } from "../entities/user.entity";
import { LogInGuard } from "../guards/user.guards";


@ApiBearerAuth()
@ApiTags('users')
@Controller('/users')
export class UserContoller {
    constructor(private userService: UserService) {}

    @Get('/current')
    @UseGuards(LogInGuard)
    currentUser(@Req() request: ExtendedRequest<User>) {
        return request.user
    }

    @Get('/account/activate')
    @ApiQuery({ name: 'token', type: 'string' })
    activateAccount(@Query('token') token: string) {
        return this.userService.verifyTokenAndActivateUser(token);
    }

    @Post('/auth/token')
    @ApiTags('auth')
    @HttpCode(HttpStatus.OK)
    async getToken(@Body() dto: UserTokenDto) {
        return this.userService.getToken(dto);
    }
}
