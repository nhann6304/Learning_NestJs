import { Body, Controller, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/interfaces/common/user.interface';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {

    constructor(private userService: UsersService) {

    }

    @Post("/login")
    async login(@Body() loginDto: LoginDto) {
        const user: LoginDto = await this.userService.findByEmail(loginDto.email);
        if (user) {
            if (user.password === loginDto.password) {
                return {
                    message: 'Đăng nhập thành công',
                    user,
                }
            } else {
                throw new UnauthorizedException("Sai mật khẩu")
            }
        }
    }

}
