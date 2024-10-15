import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './apis/common/auth/auth.controller';
import { AuthModule } from './apis/common/auth/auth.module';
import { UserEntity } from './apis/users/user.entity';
import { UsersModule } from './apis/users/users.module';
import { TokenModule } from './apis/common/token/token.module';
import { TokenEntity } from './apis/common/token/token.entity';
import { AuthMiddleware } from './apis/users/middlewares/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test_2',
      entities: [UserEntity, TokenEntity],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AuthController],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*")
  }

}
