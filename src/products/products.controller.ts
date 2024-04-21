// Importa los decoradores de NestJS para definir las rutas y los métodos HTTP
import { Controller, ParseIntPipe } from '@nestjs/common';

// Importa el servicio de productos
import { ProductsService } from './products.service';

// Importa los DTO para validar y transformar los datos de entrada y salida
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';


// Define el controlador para la entidad Product
@Controller('products')
export class ProductsController {
  // Inyecta el servicio de productos en el constructor
  constructor(private readonly productsService: ProductsService) {}

  // Crea un nuevo producto
  @MessagePattern({cmd: 'create_product'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Obtiene todos los productos
  @MessagePattern({cmd: 'find_all_products'})
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // Obtiene un producto por su ID
  @MessagePattern({cmd: 'find_one_product'})
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // Actualiza un producto por su ID
  @MessagePattern({cmd: 'update_product'})
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // Elimina un producto por su ID
  @MessagePattern({cmd: 'delete_product'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({cdm: 'validate_products'})
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
    
}
