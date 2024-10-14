import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, response, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const { token, user } = await this.authService.login(loginDto); // Lấy token từ authService
        await this.authService.saveToken(user.id, token);
        // Thiết lập cookie với token
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Đăng nhập thành công",
            token
        });
    }
    @Get("getMe")
    @UseGuards(AuthGuard)
    async getMe(@Req() req: Request) {
        const me = await this.authService.getMe(req);
        return {
            message: "Lấy thông tin thành công",
            me
        }
    }

    @Post('logout')
    async logout(@Res() response: Response) {
        return await this.authService.logout(response)
    }

}
