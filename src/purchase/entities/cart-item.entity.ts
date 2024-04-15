import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Course } from "src/course/entities/course.entity";


@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    capturedPrice: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Course, (course) => course.items)
    product: Course;
}