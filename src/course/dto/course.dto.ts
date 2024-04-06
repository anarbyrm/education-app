import { 
    IsDefined, 
    IsString, 
    IsBoolean, 
    IsOptional, 
    Min, 
    Max, 
    IsNumber, 
    Length
} from 'class-validator';


export class CreateCourseDto {
    @IsDefined()
    @IsString()
    @Length(5, 50)
    title: string;

    @IsOptional()
    @IsString()
    @Length(5, 120)
    short_description: string;

    @IsOptional()
    @IsString()
    @Length(5, 750)
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


export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    title: string;

    @IsOptional()
    @IsString()
    @Length(5, 120)
    short_description: string;

    @IsOptional()
    @IsString()
    @Length(5, 750)
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