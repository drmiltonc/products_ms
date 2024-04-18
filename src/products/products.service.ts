import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Products Service');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      try {
        const product = await this.product.create({
          data: createProductDto,
        });
        this.logger.log(`Product created: ${product.id}`);
        return product;
      } catch (error) {
        this.logger.error(`Error creating product: ${error}`);
        throw error;
      }
    } finally {
      this.$disconnect();
      this.logger.log('Database disconnected');
    }
  }

  async findAll(paginationDto: PaginationDto) {

    try {
      try {
        const totalProducts = await this.product.count();
        this.logger.log(`Total products: ${totalProducts}`);

        const products = await this.product.findMany({
          skip: (paginationDto.page - 1) * 10, //page
          take: paginationDto.limit, //limit
        });
        this.logger.log(`Products found: ${products.length}`);

        return {
          meta: {
            totalProducts,
            totalPages: Math.ceil(totalProducts / paginationDto.limit),
            page: paginationDto.page,
            limit: paginationDto.limit,
          },
          data: {
            products,
          },
        }

      } catch (error) {
        this.logger.error(`Error finding products: ${error}`);
        throw error;
      }
    }
    finally {
      this.$disconnect();
      this.logger.log('Database disconnected');
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
