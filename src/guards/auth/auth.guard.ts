import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenService } from 'src/apis/common/token/token.service';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
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
        response.cookie('token', newAccessToken, { httpOnly: true });

        // Cập nhật request.cookies.token với token mới
        request.cookies.token = newAccessToken;

        return true; // Cho phép truy cập sau khi làm mới token
      }

      return true; // Token còn hiệu lực
    } catch (error) {
      console.error("Error in AuthGuard:", error);
      await this.tokenService.deleteToken(token); // Xóa token nếu có lỗi
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }
  }
}
