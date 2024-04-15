import { Controller } from "@nestjs/common";
import { CartService } from "../services/cart.service";


@Controller()
export class CartController {
    constructor(private cartService: CartService) {}

    // TODO: 
    // getCart
    // add to cart
    // remove item from cart

}