import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { UsersService } from '../../users/users.service';
import { comparePassword } from 'src/utils/hashPass.untils';
import { Request, Response } from 'express';
import { IJwtPayload } from 'src/interfaces/common/jwt.interface';
import { IUser } from 'src/interfaces/common/user.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private tokenService: TokenService
    ) { }

    async validateUser(loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Người dùng không tồn tại');
        }
        const checkPassword = await comparePassword(loginDto.password, user.password)

        if (!checkPassword) {
            throw new UnauthorizedException('Sai mật khẩu');
        } else {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials'); // Ném lỗi nếu không tìm thấy người dùng
        }
        const token = await this.tokenService.createToken(user.id, user.email);
        return {
            user,
            token,
        };

    }

    async getMe(req: Request): Promise<IUser> {
        const token = req.cookies.token;
        if (token) {
            try {
                const decode = await this.tokenService.checkToken(token);
                const result = await this.userService.findByEmail(decode.email);

                if (!result) {
                    throw new UnauthorizedException('Người dùng không tồn tại');
                }
                return result;
            } catch (error) {
                console.error("Error verifying token:", error); // Ghi lại lỗi
                throw new UnauthorizedException('Token không hợp lệ');
            }
        } else {
            throw new UnauthorizedException('Vui lòng đăng nhập lại');
        }
    }

    async logout(res: Response, req: Request) {
        const token = req.cookies.token
        await this.tokenService.deleteToken(token);
        await res.clearCookie('token', { httpOnly: true, secure: true });
        return res.status(200).json({
            message: 'Đăng xuất thành công',
        });
    }


}
