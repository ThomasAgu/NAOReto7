import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: 'mysql://root:vv3Ikz7WhbboRassOMZs@containers-us-west-120.railway.app:8041/railway',
      type: 'mysql',
      host: 'containers-us-west-120.railway.app',
      port: 8041,
      username: 'root',
      password: 'vv3Ikz7WhbboRassOMZs',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
