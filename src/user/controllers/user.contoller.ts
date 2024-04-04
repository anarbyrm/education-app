import { Controller, Get, Query, Req } from "@nestjs/common";
import { ExtendedRequest } from "../interfaces/request.interface";
import { UserService } from "../services/user.service";


@Controller('/users')
export class UserContoller {
    constructor(private userService: UserService) {}

    @Get('/current')
    currentUser(@Req() request: ExtendedRequest) {
        return request.user
    }

    @Get('/account/activate')
    activateAccount(@Query('token') token: string) {
        return this.userService.verifyTokenAndActivateUser(token);
    }

}
