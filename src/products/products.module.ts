import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

// Módulo de productos
@Module({
  // Controladores del módulo
  controllers: [ProductsController],
  
  // Proveedores del módulo
  providers: [ProductsService],
})

// Clase del módulo de productos
export class ProductsModule {}


