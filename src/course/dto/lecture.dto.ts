import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Length, Min } from "class-validator";


export class CreateLectureDto {
    @IsString()
    @Length(5, 50)
    @ApiProperty()
    title: string;

    @Min(1)
    @Type(() => Number)
    @ApiProperty()
    duration: number;

    @Type(() => Boolean)
    @ApiProperty()
    isPublished: boolean;

    @Min(1)
    @Type(() => Number)
    @ApiProperty()
    order: number;
}

export class UpdateLectureDto {
    @IsString()
    @IsOptional()
    @Length(5, 50)
    @ApiProperty({ required: false })
    title: string;

    @Min(1)
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({ required: false })
    duration: number;

    @Type(() => Boolean)
    @IsOptional()
    @ApiProperty({ required: false })
    isPublished: boolean;

    @Min(1)
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({ required: false })
    order: number;
}
