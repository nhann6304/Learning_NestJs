import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies.token;

    // Kiểm tra xem có token không
    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }

    try {
      // Kiểm tra token
      await this.jwtService.verifyAsync(token);
      return true; // Nếu token hợp lệ, cho phép truy cập
    } catch (error) {
      // Nếu jwt hết hạn thì refresh token
      if (error.name === 'TokenExpiredError') {
        const newToken = await this.refreshToken(token);
        response.cookie('token', newToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); // Đặt cookie với secure
        return true; // Cho phép truy cập sau khi làm mới token
      }
      // Ném lỗi cho các trường hợp khác
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  private async refreshToken(oldToken: string): Promise<string> {
    try {
      // Giải mã payload
      const payload = this.jwtService.decode(oldToken) as { email: string }; // Decoding payload
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // Tạo token mới
      return await this.jwtService.signAsync({ email: payload.email }, { expiresIn: '10s' }); // Đặt thời gian hết hạn cho token mới
    } catch (error) {
      throw new UnauthorizedException('Không thể làm mới token');
    }
  }
}
