import { Type } from "class-transformer";
import { IsOptional, IsString, Length, Min } from "class-validator";


export class CreateLectureDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @Min(1)
    @Type(() => Number)
    duration: number;

    @Type(() => Boolean)
    isPublished: boolean;

    @Min(1)
    @Type(() => Number)
    order: number;
}

export class UpdateLectureDto {
    @IsString()
    @IsOptional()
    @Length(50)
    title: string;

    @Min(1)
    @Type(() => Number)
    @IsOptional()
    duration: number;

    @Type(() => Boolean)
    @IsOptional()
    isPublished: boolean;

    @Min(1)
    @Type(() => Number)
    @IsOptional()
    order: number;
}
