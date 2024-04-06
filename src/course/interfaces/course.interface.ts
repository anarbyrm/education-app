import { Course } from "../entities/course.entity";


export interface ICourseQuery {
    search: string;
    minPrice: number;
    maxPrice: number;
    rating: number;
    paid: boolean;
    published: boolean;
}