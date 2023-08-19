import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'src/config';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: DB_PORT,
      host: DB_HOST,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
