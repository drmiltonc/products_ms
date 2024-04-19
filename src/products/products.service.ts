// Importamos las dependencias necesarias
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto'; // Importamos el DTO para crear productos
import { UpdateProductDto } from './dto/update-product.dto'; // Importamos el DTO para actualizar productos
import { RpcException } from '@nestjs/microservices'; // Importamos la excepción para manejar errores
import { PrismaClient } from '@prisma/client'; // Importamos el cliente de Prisma
import { PaginationDto } from 'src/common/dto'; // Importamos el DTO para la paginación

// Marcamos la clase como injectable
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit { // Extendemos la clase de PrismaClient e implementamos la interfaz OnModuleInit

  private readonly logger = new Logger('ProductsService');// Creamos una instancia del logger

  // Método que se ejecuta cuando se inicializa el módulo
  onModuleInit() {
    this.$connect(); // Conectamos a la base de datos
    this.logger.log('Database connected'); // Registramos en el logger que la base de datos está conectada
  }

  // Método para crear un producto
  create(createProductDto: CreateProductDto) {
    // Creamos un producto en la base de datos
    return this.product.create({
      data: createProductDto // Pasamos los datos del DTO como datos para crear el producto
    });
  }

  // Método para obtener todos los productos
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto; // Extraemos la página y el límite de la paginación
    const totalPages = await this.product.count({ where: { available: true } }); // Contamos los productos disponibles
    const lastPage = Math.ceil(totalPages / limit); // Calculamos la última página

    // Obtenemos los productos de la base de datos
    return {
      // Devolvemos un objeto con los datos y los metadatos de la paginación
      data: await this.product.findMany({
        skip: (page - 1) * limit, // Saltamos los productos de las páginas anteriores
        take: limit, // Limitamos el número de productos a devolver
        where: { available: true } // Filtramos los productos por disponibilidad
      }),
      meta: { // Metadatos de la paginación
        total: totalPages, // Total de páginas
        page: page, // Página actual
        lastPage: lastPage, // Última página
      }
    }
  }

  // Método para obtener un producto por su ID
  async findOne(id: number) {
    // Buscamos el producto en la base de datos
    const product = await this.product.findFirst({
      where: { id, available: true } // Filtramos por ID y disponibilidad
    });

    // Si no encontramos el producto
    if (!product) {
      // Lanzamos una excepción
      throw new RpcException({
        message: `Product with id #${id} not found`, // Mensaje de error
        status: HttpStatus.BAD_REQUEST // Código de estado de error
      });
    }

    return product; // Devolvemos el producto
  }

  // Método para actualizar un producto
  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto; // Extraemos el ID y los datos del DTO

    // Buscamos el producto en la base de datos
    await this.findOne(id);

    // Actualizamos el producto en la base de datos
    return this.product.update({
      where: { id }, // Filtramos por ID
      data: data, // Pasamos los datos del DTO como datos para actualizar el producto
    });
  }

  // Método para eliminar un producto
  async remove(id: number) {

    await this.findOne(id); // Buscamos el producto en la base de datos

    // Actualizamos el producto en la base de datos
    const product = await this.product.update({
      where: { id }, // Filtramos por ID
      // Pasamos los datos para actualizar el producto
      data: { available: false } // Marcamos el producto como no disponible
    });

    return product; // Devolvemos el producto actualizado
  }
}
