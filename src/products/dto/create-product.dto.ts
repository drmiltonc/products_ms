import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, Min } from "class-validator";

// DTO para crear un producto
export class CreateProductDto {

   
    // Nombre del producto
    @IsString()
    public name: string;

    
    // Precio del producto
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    @Type(() => Number)
    public price: number;
}

