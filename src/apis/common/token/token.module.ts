import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';
import { UsersModule } from '../../users/users.module';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([TokenEntity]),
        ConfigModule.forRoot(),
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                // secret: "1b8e3446-d4db-41b5-acb7-6349143266ff",
                signOptions: {
                    expiresIn: configService.get<string>("TIME_END"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [TokenService], // Khai báo TokenService
    exports: [TokenService, JwtModule], // Xuất TokenService
})
export class TokenModule { }
