import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import envVars from './config/envs';

//This is the main function of the application.
async function main() {
  
  //It creates a NestJS application and listens on the specified port.
  const app = await NestFactory.create(AppModule);

  //It also uses a global validation pipe to validate all incoming requests.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //Finally, it logs the application URL and environment to the console.
  await app.listen(envVars.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${envVars.PORT}`);

}
main();
