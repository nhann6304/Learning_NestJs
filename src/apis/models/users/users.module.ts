import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from '../../common/auth/auth.module'; // Đường dẫn đúng
import { ExampleMiddleware } from '../../../middlewares/example/example.middleware';
import { TokenModule } from '../../common/token/token.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './handler/create-user.handler';
import { GetUserHandler } from './handler/get-user.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => TokenModule),
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NATS_STREAMING',
        transport: Transport.NATS,
        options: {
          url: 'http://localhost:3000',
          clusterId: 'test-cluster',
          clientId: 'test-client',
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateUserHandler, GetUserHandler],
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
    // .apply(AnotherMiddleware)
    // .forRoutes({
    //   path: 'users/create',
    //   method: RequestMethod.POST,
    // });
  }
}
