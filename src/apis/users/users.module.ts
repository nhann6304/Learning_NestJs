import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from '../common/auth/auth.module'; // Đường dẫn đúng
import { ExampleMiddleware } from './middlewares/example/example.middleware';
import { AnotherMiddleware } from './middlewares/another/another.middleware';
import { TokenModule } from '../common/token/token.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => TokenModule),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExampleMiddleware)
      .forRoutes({
        path: 'users/:id/:postId',
        method: RequestMethod.GET,
      })
      .apply(AnotherMiddleware)
      .forRoutes({
        path: 'users/create',
        method: RequestMethod.POST,
      });
  }
}
