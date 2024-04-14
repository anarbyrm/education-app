import { ApiProperty } from "@nestjs/swagger";


export class CourseQuery {
    @ApiProperty({ required: false })
    search?: string;

    @ApiProperty({ required: false })
    minPrice?: number;

    @ApiProperty({ required: false })
    maxPrice?: number;

    @ApiProperty({ required: false })
    rating?: number;

    @ApiProperty({ required: false })
    paid?: boolean;

    @ApiProperty({ required: false })
    published?: boolean;
}