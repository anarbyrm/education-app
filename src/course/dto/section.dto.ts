import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min, Length, IsOptional } from "class-validator";


export class CreateSectionDto {
    @IsString()
    @Length(5, 50)
    @ApiProperty()
    title: string;

    @IsNumber()
    @Min(1)
    @ApiProperty()
    order: number;
}


export class UpdateSectionDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    @ApiProperty({ required: false })
    title: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @ApiProperty({ required: false })
    order: number;
}