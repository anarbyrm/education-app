import { ChildEntity, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Rating } from 'src/course/entities/rating.entity';
import { Review } from 'src/course/entities/review.entity';
import { Course } from 'src/course/entities/course.entity';

@ChildEntity()
export class Student extends User {
    @ManyToMany(() => Course, (course) => course.students)
    courses: Course[];

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings: Rating[];

    @OneToMany(() => Rating, (review) => review.user)
    reviews: Review[];   
}