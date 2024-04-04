import { Controller, Get, Req } from "@nestjs/common";
import { ExtendedRequest } from "../interfaces/request.interface";


@Controller('/users')
export class UserContoller {
    constructor() {}

    @Get('current')
    currentUser(@Req() request: ExtendedRequest) {
        return request.user
    }

}
