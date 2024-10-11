import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/utils/hashPass.untils';
import { Request } from 'express';
import { IJwtPayload } from 'src/interfaces/common/jwt.interface';
import { IUser } from 'src/interfaces/common/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
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

        const payload = { email: user.email, sub: user.id };
        const token = await this.jwtService.signAsync(payload); // Tạo token từ payload

        return {
            token,
        };
    }

    async getProfile(req: Request): Promise<IUser> {
        const token = req.cookies.token;
        if (token) {
            try {
                const decode: IJwtPayload = await this.jwtService.verifyAsync(token);
                const result = await this.userService.findByEmail(decode.email);
                return result;
            } catch (error) {
                throw new UnauthorizedException(error);
            }
        } else {
            throw new UnauthorizedException('Vui lòng đăng nhập lại');
        }
    }
}
