// NestFactory es una clase que proporciona métodos para crear instancias de aplicaciones NestJS.
import { NestFactory } from '@nestjs/core';

// AppModule es el módulo principal de la aplicación NestJS que contiene todos los demás módulos y controladores.
import { AppModule } from './app.module';

// ValidationPipe es un pipe que valida las solicitudes entrantes según las reglas de validación definidas en los DTO.
import { ValidationPipe, Logger } from '@nestjs/common';

// envVars es un objeto que contiene las variables de entorno de la aplicación.
import envVars from './config/envs';

//Importa las opciones de microservicio y el transporte de @nestjs/microservices
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async indica que la función es asíncrona y puede contener operaciones asíncronas.
async function main() {

  // Crea una instancia del registrador de NestJS
  // Logger es una clase que proporciona métodos para registrar mensajes en la consola.
  const logger = new Logger('Main');

  // createMicroservice() crea una instancia de una aplicación NestJS que utiliza un transporte de microservicio.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envVars.PORT
      }
    },
  );

  // useGlobalPipes() aplica un pipe a todas las solicitudes entrantes.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true activa la validación de la lista blanca, lo que significa que solo se permitirán las propiedades incluidas en la lista blanca.
      whitelist: true,
      // forbidNonWhitelisted: true prohíbe las propiedades que no están incluidas en la lista blanca.
      forbidNonWhitelisted: true,
    })
  );

  // listen() inicia la aplicación en el puerto especificado.
  await app.listen();

  // log() registra un mensaje en la consola.
  logger.log(`Environment: ${envVars.PORT}`);

}

// main() invoca la función principal para iniciar la aplicación.
main();

