import { Student } from "src/user/entities/student.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderItem } from "./order-item.entity";


@Entity()
export class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    total: number;

    @Column()
    completed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Student, (student) => student.orders)
    user: Student

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[]
}