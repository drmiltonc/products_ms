// Importa los decoradores de NestJS para definir las rutas y los métodos HTTP
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

// Importa el servicio de productos
import { ProductsService } from './products.service';

// Importa los DTO para validar y transformar los datos de entrada y salida
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';


// Define el controlador para la entidad Product
@Controller('products')
export class ProductsController {
  // Inyecta el servicio de productos en el constructor
  constructor(private readonly productsService: ProductsService) {}

  // Crea un nuevo producto
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Obtiene todos los productos
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // Obtiene un producto por su ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // Actualiza un producto por su ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Elimina un producto por su ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  
}
