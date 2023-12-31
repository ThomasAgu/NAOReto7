import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PORT } from './config'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Documentacion API REST libreria')
    .setDescription(
      'Van a encontrar rutas para el majeo de usuarios, libros, prestamos y autores',
    )
    .setVersion('1.0')
    .addTag('libros')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
