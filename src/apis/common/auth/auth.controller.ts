import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { request, Request, response, Response } from 'express';
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
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000  // 15 ngày
        });

        return res.status(200).json({
            message: "Đăng nhập thành công",
            token
        });
    }
    @Get("getMe")
    async getMe(@Req() req: Request) {
        const me = await this.authService.getMe(req);
        return {
            message: "Lấy thông tin thành công",
            me
        }
    }

    @Post('logout')
    async logout(@Res() response: Response, @Req() request: Request) {
        return await this.authService.logout(response, request)
    }

}
