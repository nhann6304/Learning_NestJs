import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './apis/auth/auth.controller';
import { AuthModule } from './apis/auth/auth.module';
import { UserEntity } from './apis/users/user.entity';
import { UsersModule } from './apis/users/users.module';

@Module({
  imports: [
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
    UsersModule,
    AuthModule,
  ],
  controllers: [AuthController],
})
export class AppModule { }
