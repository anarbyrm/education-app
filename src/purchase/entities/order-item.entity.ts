import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "./purchase.entity";


@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;

    @ManyToOne(() => Purchase, (order) => order.items)
    order: Purchase;
}