import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
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

        if (user.password !== loginDto.password) {
            throw new UnauthorizedException('Sai mật khẩu');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }


    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
