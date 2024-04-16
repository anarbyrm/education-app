import { Body, Controller, Get, ParseUUIDPipe, Post, Req, UseGuards } from "@nestjs/common";
import { CartService } from "../services/cart.service";
import { LogInGuard } from "src/user/guards/user.guards";
import { ExtendedRequest } from "src/user/interfaces/request.interface";
import { Student } from "src/user/entities/student.entity";


@Controller('/cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    @UseGuards(LogInGuard)
    getCart(@Req() request: ExtendedRequest<Student>) {
        const userId = request.user.id;
        return this.cartService.fetchCart(userId);
    }

    @Post('/add-item')
    @UseGuards(LogInGuard) // TODO: add owner guard for cart
    addItemToCart(
        @Req() request: ExtendedRequest<Student>,
        @Body('courseId', ParseUUIDPipe) courseId: string
    ) {
        const userId = request.user.id;
        return this.cartService.addToCart(userId, courseId);
    }

    @Post('/remove-item')
    @UseGuards(LogInGuard)
    removeItemFromCart(
        @Req() request: ExtendedRequest<Student>,
        @Body('courseId') courseId: string
    ) {
        const userId = request.user.id;
        return this.cartService.removeFromCart(userId, courseId);
    }

    @Post('/empty')
    emptyWholeCart(
        @Req() request: ExtendedRequest<Student>
    ) {
        const userId = request.user.id;
        return this.cartService.emptyCart(userId);
    }
}