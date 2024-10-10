import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './apis/auth/auth.controller';
import { AuthModule } from './apis/auth/auth.module';
import { UsersModule } from './apis/users/users.module';
import { UserEntity } from './apis/users/user.entity';


@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test_2',
      entities: [UserEntity],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AuthController],

})


export class AppModule { }

