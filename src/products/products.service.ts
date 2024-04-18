// Importaciones de módulos de NestJS
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';

// Importaciones de DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Importación del cliente de Prisma
import { PrismaClient } from '@prisma/client';

// Importación del DTO de paginación
import { PaginationDto } from 'src/common/dto';

// Servicio de productos
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Products Service'); // Variable privada para el registro

  // Método que se ejecuta al inicializar el módulo
  onModuleInit() {
    this.$connect(); // Conectar a la base de datos
    this.logger.log('Database connected'); // Registrar en el log que la base de datos está conectada
  }

  // Método para crear un producto
  async create(createProductDto: CreateProductDto) {
    try {
      try {
        const product = await this.product.create({
          data: createProductDto,
        }); // Crear un producto en la base de datos
        this.logger.log(`Product created: ${product.id}`); // Registrar en el log que el producto fue creado
        return product; // Devolver el producto creado

      } catch (error) {
        this.logger.error(`Error creating product: ${error}`); // Registrar en el log el error al crear el producto
        throw error; // Lanzar el error
      }

    } finally {
      this.$disconnect(); // Desconectar de la base de datos
      this.logger.log('Database disconnected'); // Registrar en el log que la base de datos está desconectada
    }
  }

  // Método para obtener todos los productos
  async findAll(paginationDto: PaginationDto) {

    try {
      const totalProducts = await this.product.count({
        where: { available: true },
      });// Obtener el número total de productos
      this.logger.log(`Total products: ${totalProducts}`); // Registrar en el log el número total de productos

      const products = await this.product.findMany({
        where: { available: true },
        skip: (paginationDto.page - 1) * 10, //page
        take: paginationDto.limit, //limit
      }); // Obtener los productos paginados
      this.logger.log(`Products found: ${products.length}`); // Registrar en el log el número de productos encontrados

      // Devolver los productos y los metadatos de la paginación
      return {
        meta: {
          totalProducts,
          totalPages: Math.ceil(totalProducts / paginationDto.limit),
          page: paginationDto.page,
          limit: paginationDto.limit,
        },
        data: { products },
      }
    }

    catch (error) {
      this.logger.error(`Error finding products: ${error}`); // Registrar en el log el error al obtener los productos
      throw error; // Lanzar el error
    }

    finally {
      this.$disconnect(); // Desconectar de la base de datos
      this.logger.log('Database disconnected'); // Registrar en el log que la base de datos está desconectada
    }
  }


  // Método para obtener un producto por su ID
  async findOne(id: number) {
    try {
      const product = await this.product.findUnique({
        where: { id, available: true },
      }); // Buscar el producto en la base de datos
      this.logger.log(`Product found: ${product.id}`); // Registrar en el log que el producto fue encontrado
      this.logger.log(`Product name: ${product.name}`); // Registrar en el log el nombre del producto
      this.logger.log(`Product price: ${product.price}`); // Registrar en el log el precio del producto

      // Si el producto no existe, lanzar una excepción
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product; // Devolver el producto

    } catch (error) {
      this.logger.error(`Error finding product: ${error}`); // Registrar en el log el error al obtener el producto
      throw error; // Lanzar el error

    } finally {
      this.$disconnect(); // Desconectar de la base de datos
      this.logger.log('Database disconnected'); // Registrar en el log que la base de datos está desconectada
    }
  }

  // Método para actualizar un producto
  async update(id: number, updateProductDto: UpdateProductDto) {

    try {

      const {id: __, ...data} = updateProductDto;

      await this.findOne(id); // Buscar el producto en la base de datos
      this.logger.log(`Product found: ${id}`); // Registrar en el log que el producto fue encontrado

      // Actualizar el producto en la base de datos
      const product = await this.product.update({
        where: { id },
        data: data,
      });
      this.logger.log(`Product updated: ${id}`); // Registrar en el log que el producto fue actualizado

      // Si el producto no existe, lanzar una excepción
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product; // Devolver el producto actualizado

    } catch (error) {
      this.logger.error(`Error updating product: ${error}`); // Registrar en el log el error al actualizar el producto
      throw error; // Lanzar el error

    } finally {
      this.$disconnect(); // Desconectar de la base de datos
      this.logger.log('Database disconnected'); // Registrar en el log que la base de datos está desconectada
    }
  }

  // Método para eliminar un producto
  async remove(id: number) {

    try {

      await this.findOne(id); // Buscar el producto en la base de datos
      this.logger.log(`Product found: ${id}`); // Registrar en el log que el producto fue encontrado

      // Actualizar el producto en la base de datos para marcarlo como no disponible
      const product = await this.product.update({
        where: { id },
        data: {
          available: false,
        },
      });
      this.logger.log(`Product removed: ${id}`); // Registrar en el log que el producto fue eliminado

      // Si el producto no existe, lanzar una excepción
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product; // Devolver el producto eliminado

    } catch (error) {
      this.logger.error(`Error removing product: ${error}`); // Registrar en el log el error al eliminar el producto
      throw error; // Lanzar el error

    } finally {
      this.$disconnect(); // Desconectar de la base de datos
      this.logger.log('Database disconnected'); // Registrar en el log que la base de datos está desconectada
    }
    ;
  }
}
