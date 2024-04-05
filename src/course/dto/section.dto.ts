import { IsNumber, IsString, Min, Length } from "class-validator";


export class CreateSectionDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @IsNumber()
    @Min(1)
    order: number;
}