import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot(),
        forwardRef(() => UsersModule), // Sử dụng forwardRef ở đây cũng cần thiết
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '5m',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
