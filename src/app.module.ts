import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './apis/common/auth/auth.controller';
import { AuthModule } from './apis/common/auth/auth.module';
import { UserEntity } from './apis/models/users/user.entity';
import { UsersModule } from './apis/models/users/users.module';
import { TokenModule } from './apis/common/token/token.module';
import { TokenEntity } from './apis/common/token/token.entity';
import { AuthMiddleware } from './apis/models/users/middlewares/auth/auth.middleware';
import { mysqlConfig } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    UsersModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AuthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
