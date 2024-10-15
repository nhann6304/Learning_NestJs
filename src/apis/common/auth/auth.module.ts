import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/users.module';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule,
        forwardRef(() => TokenModule),
        forwardRef(() => UsersModule),

    ],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, JwtModule], // Xuất JwtModule
})
export class AuthModule { }
