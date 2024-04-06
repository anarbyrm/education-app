import { IsNumber, IsString, Min, Length, IsOptional } from "class-validator";


export class CreateSectionDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @IsNumber()
    @Min(1)
    order: number;
}


export class UpdateSectionDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    title: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    order: number;
}