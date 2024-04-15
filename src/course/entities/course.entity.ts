import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToOne,
    ManyToOne,
    ManyToMany,
    OneToMany,
    JoinTable
} from 'typeorm';

import { Student } from 'src/user/entities/student.entity';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CourseContent } from './course-content.entity';
import { Rating } from './rating.entity';
import { Review } from './review.entity';
import { Category } from './category.entity';
import { CartItem } from 'src/purchase/entities/cart-item.entity';


@Entity()
export class Course {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ length: 50 })
    title: string;

    @Column({ length: 120, nullable: true })
    short_description: string;

    @Column({ length: 750, nullable: true })
    description: string;

    @Column({ type: 'float', precision: 4, scale: 2 })
    price: number

    @Column({ type: 'float', precision: 4, scale: 2 })
    discountedPrice: number

    @Column({ default: false })
    isPublished: boolean;

    @Column({ default: true })
    isPaid: boolean;

    @Column({ unique: true })
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // relations
    @OneToOne(() => CourseContent, (content) => content.course)
    content: CourseContent;

    @ManyToOne(() => Category, (category) => category.courses)
    category: Category;

    @ManyToOne(() => Tutor, (tutor) => tutor.courses)
    instructor: Tutor;

    @ManyToMany(() => Student)
    @JoinTable()
    students: Student[];
    
    @OneToMany(() => Rating, (rating) => rating.course)
    ratings: Rating[];

    @OneToMany(() => Review, (review) => review.course)
    reviews: Review[];

    @OneToMany(() => CartItem, (item) => item.product)
    items: CartItem[];
}