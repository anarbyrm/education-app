import { 
    IsDefined, 
    IsString, 
    IsBoolean, 
    IsOptional, 
    Min, 
    Max, 
    IsNumber 
} from 'class-validator';


export class CreateCourseDto {
    @IsDefined()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    short_description: string;

    @IsOptional()
    @IsString()
    description: string;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    discountedPrice: number;

    @IsBoolean()
    @IsOptional()
    isPublished: boolean;

    @IsBoolean()
    @IsOptional()
    isPaid: boolean;

    @IsString()
    @IsOptional()
    slug: string;
}