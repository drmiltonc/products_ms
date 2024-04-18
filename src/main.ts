// Importa el módulo de fábrica de NestJS para crear la aplicación
import { NestFactory } from '@nestjs/core';

// Importa el módulo principal de la aplicación
import { AppModule } from './app.module';

// Importa el pipe de validación de NestJS para validar las solicitudes entrantes
import { ValidationPipe, Logger } from '@nestjs/common';

// Importa las variables de entorno
import envVars from './config/envs';

// Función principal asíncrona para iniciar la aplicación
async function main() {

  // Crea una instancia del registrador de NestJS
  const logger = new Logger('Main');

  // Crea una instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Aplica el pipe de validación a todas las solicitudes entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      // Activa la lista blanca de propiedades permitidas
      whitelist: true,
      // Prohíbe las propiedades no incluidas en la lista blanca
      forbidNonWhitelisted: true,
    })
  );

  // Inicia la aplicación en el puerto especificado en las variables de entorno
  await app.listen(envVars.PORT);

  // Imprime el entorno actual
  logger.log(`Environment: ${envVars.PORT}`);

}

// Invoca la función principal para iniciar la aplicación
main();
