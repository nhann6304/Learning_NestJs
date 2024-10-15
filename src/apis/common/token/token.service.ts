import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './token.entity'; // Import TokenEntity
import { v4 as uuidv4 } from 'uuid'; // Nhớ import uuidv4
import { IJwtPayload } from 'src/interfaces/common/jwt.interface';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(TokenEntity) // Inject repository cho TokenEntity
        private readonly tokenRepository: Repository<TokenEntity>
    ) { }

    async createToken(id: string, email: string): Promise<string> {
        const payload = { id, email };
        const token = await this.jwtService.signAsync(payload);

        // Tạo một instance mới của TokenEntity
        const newToken = this.tokenRepository.create({
            id: uuidv4(),
            accessToken: token,
            user_id: id,
        });

        // Lưu vào cơ sở dữ liệu
        await this.tokenRepository.save(newToken);
        return token;
    }

    // async validateToken(token: string): Promise<boolean> {
    //     try {
    //         const result = await this.jwtService.verifyAsync(token);
    //         console.log("tokenService:::", result);
    //         return true;
    //     } catch (error) {
    //         if (error.name === 'TokenExpiredError') {
    //             await this.deleteToken(token);
    //             return false; // Trả về false để cho AuthGuard xử lý
    //         }
    //         throw new UnauthorizedException('Token không hợp lệ');
    //     }
    // }

    async validateToken(token: string, idUser: string): Promise<boolean> {
        try {
            const result = await this.jwtService.verifyAsync(token);
            if (idUser === result.id) {
                return true;
            } else {
                throw new UnauthorizedException('Token không trùng khớp');
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                await this.deleteToken(token);
                return false; // Trả về false để cho AuthGuard xử lý
            }
            throw new UnauthorizedException('Token không hợp lệ');
        }
    }


    async checkToken(token: string) {
        const decode: IJwtPayload = await this.jwtService.decode(token);
        return decode;
    }

    async deleteToken(token: string) {
        return await this.tokenRepository.delete({ accessToken: token });
    }

    async createRefreshToken(userId: string): Promise<string> {
        const refreshToken = await this.jwtService.signAsync({ userId }, { expiresIn: '7d' }); // Thời gian sống của refresh token

        // Lưu refresh token vào cơ sở dữ liệu
        const newToken = this.tokenRepository.create({
            id: uuidv4(),
            accessToken: refreshToken,
            user_id: userId,
            isRefreshToken: true, // Cờ để phân biệt refresh token
        });

        await this.tokenRepository.save(newToken);
        return refreshToken;
    }

    async verifyRefreshToken(refreshToken: string): Promise<any> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            return payload; // Trả về payload để lấy userId
        } catch (error) {
            throw new UnauthorizedException('Refresh token không hợp lệ');
        }
    }
}
