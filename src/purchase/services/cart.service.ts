import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cart-item.entity";


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>
    ) {}

    async fetchCart(userId: number) {
        let cart = await this.cartRepository.findOne({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                user: true,
                items: true
            }
        })

        // if no cart exists for current user create one 
        // and assign it to the cart variable.
        if (!cart) {
            const cartInstance = this.cartRepository.create({
                user: {
                    id: userId
                }
            });
            const newCart = await this.cartRepository.save(cartInstance);

            cart = await this.cartRepository.findOne({
                where: {
                    id: newCart.id
                },
                relations: {
                    items: true,
                    user: true
                }
            });
        }
        
        return cart;
    }

    addToCart(userId: number, courseId: string) {

    }

    removeFromCart(userId: number, courseId: string) {

    }
}