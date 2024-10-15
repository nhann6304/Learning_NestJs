import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users.service';
import { TokenService } from 'src/apis/common/token/token.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) { }

  async use(request: Request, response: Response, next: () => void) {
    console.log("Duyệt qua AuthMiddleware");

    const excludedPaths = ['/api/v1/auth/login', '/api/register']; // Các đường dẫn k duyệt qua

    if (excludedPaths.includes(request.baseUrl)) {
      return next();
    }


    const token = request.cookies.token;

    const infoToken = await this.tokenService.checkToken(token)

    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }

    try {
      // Kiểm tra access token
      const isValid = await this.tokenService.validateToken(token, infoToken.id);
      if (!isValid) {

        // Token đã hết hạn, tạo access token mới
        const user = await this.tokenService.checkToken(token); // Lấy userId từ token cũ
        // Lấy email của người dùng từ userId
        const result = await this.userService.findByEmail(user.email);

        // Tạo access token mới
        const newAccessToken = await this.tokenService.createToken(result.id, result.email);

        // Gửi access token mới cho người dùng
        response.cookie('token', newAccessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 24 * 60 * 60 * 1000  // 15 ngày
        });

        // Cập nhật request.cookies.token với token mới
        request.cookies.token = newAccessToken;

        next();
        // return true; // Cho phép truy cập sau khi làm mới token

      }

      next();
      // return true; // Token còn hiệu lực

    } catch (error) {
      console.error("Error in AuthGuard:", error);
      await this.tokenService.deleteToken(token); // Xóa token nếu có lỗi
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }
  }
}
