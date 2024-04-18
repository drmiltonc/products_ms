// Módulo principal de la aplicación
import { Module } from '@nestjs/common';

// Módulo de productos
import { ProductsModule } from './products/products.module';

// Módulo de productos
@Module({
  imports: [ProductsModule], // Importa el módulo de productos
})

// Clase del módulo principal
export class AppModule {}
