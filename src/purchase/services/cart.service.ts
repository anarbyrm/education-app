import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cart-item.entity";
import { Course } from "src/course/entities/course.entity";
import { NotFoundError } from "rxjs";


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>
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
                items: {
                    product: true
                }
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

    private async getCartAndCourseAndCartItemIds(userId: number, courseId: string) {
        const cart = await this.fetchCart(userId);
        const course = await this.courseRepository.findOne({
            where: {
                id: courseId
            }
        });

        if (!course) throw new NotFoundException('Course with specified id not found.');

        const cartItemIds = cart.items.map((item) => item.product.id);
        return { cart, course, cartItemIds }
    }

    async addToCart(userId: number, courseId: string) {
        const { cart, course, cartItemIds } = await this.getCartAndCourseAndCartItemIds(userId, courseId);
        if (cartItemIds.includes(courseId)) throw new BadRequestException('Cart item already exists in the cart.');

        const newCartItem = this.cartItemRepository.create({
            capturedPrice: course.discountedPrice,
            cart: cart,
            product: course
        })
        await this.cartItemRepository.save(newCartItem);
        return this.fetchCart(userId);
    }

    async removeFromCart(userId: number, courseId: string) {
        const { cart, course, cartItemIds } = await this.getCartAndCourseAndCartItemIds(userId, courseId);
        if (!cartItemIds.includes(course.id)) throw new BadRequestException('Cart item does not exists in the cart.');

        // search for course and delete related item from the cart.
        const seachedItemIndex = cartItemIds.indexOf(course.id);
        const cartItemId = cart.items[seachedItemIndex].id;
        await this.cartItemRepository.delete(cartItemId);
        return this.fetchCart(userId);
    }

    emptyCart() {

    }
}