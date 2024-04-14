import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsString()
    @Length(5, 120)
    @ApiProperty({ required: false })
    short_description: string;

    @IsOptional()
    @IsString()
    @Length(5, 750)
    @ApiProperty({ required: false })
    description: string;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    price: number;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    discountedPrice: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    isPublished: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    isPaid: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    slug: string;
}


export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    @ApiProperty({ required: false })
    title: string;

    @IsOptional()
    @IsString()
    @Length(5, 120)
    @ApiProperty({ required: false })
    short_description: string;

    @IsOptional()
    @IsString()
    @Length(5, 750)
    @ApiProperty({ required: false })
    description: string;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ required: false })
    price: number;

    @Max(9999.99)
    @Min(0)
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ required: false })
    discountedPrice: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    isPublished: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    isPaid: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    slug: string;
}