import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LibrosModule } from './libros/libros.module';
import { AuthorsModule } from './authors/authors.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    LibrosModule,
    AuthorsModule,
    PrestamosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
