import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @UseGuards(AuthGuard)
    @Post("/login")
    async login(@Body() login: LoginDto, @Request() req: Req) {
        // console.log(req.body); // Lấy value từ guards trả về
        return this.authService.login(login)
    }
}
