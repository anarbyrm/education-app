export interface ICourseQuery {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    paid?: boolean;
    published?: boolean;
}