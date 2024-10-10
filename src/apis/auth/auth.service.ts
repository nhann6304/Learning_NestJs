import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/utils/hashPass.untils';

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
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
