import { Module } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { LibrosModule } from 'src/libros/libros.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo]), LibrosModule, UsersModule],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
