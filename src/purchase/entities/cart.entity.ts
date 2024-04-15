import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Student } from "src/user/entities/student.entity";


@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Student)
    @JoinColumn()
    user: Student;

    @OneToMany(() => CartItem, (item) => item.cart)
    items: CartItem[];
}