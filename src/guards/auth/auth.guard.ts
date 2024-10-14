import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from 'src/apis/auth/auth.service';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) { }

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
      const payload = await this.jwtService.verifyAsync(token);
      const email = payload.email;

      // Xác thực token với database
      const isValidToken = await this.validateTokenInDB(email, token);
      if (!isValidToken) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã bị thay đổi');
      }

      return true;
    } catch (error) {
      // Nếu jwt hết hạn thì refresh token
      if (error.name === 'TokenExpiredError') {
        const newToken = await this.refreshToken(token);
        response.cookie('token', newToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
        return true; // Cho phép truy cập sau khi làm mới token
      }

      // Ném lỗi cho các trường hợp khác
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  private async validateTokenInDB(email: string, oldToken: string): Promise<boolean> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }
      const isValidToken = user.token === oldToken;
      return isValidToken;
    } catch (error) {
      throw new UnauthorizedException('Xác thực token không thành công');
    }
  }

  private async refreshToken(oldToken: string): Promise<string> {
    try {
      const payload = this.jwtService.decode(oldToken) as { email: string };
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const email = payload.email;
      const isValidToken = await this.validateTokenInDB(email, oldToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã bị thay đổi');
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      // Tạo token mới với thời gian hết hạn hợp lý
      const newToken = await this.jwtService.signAsync(
        { email: user.email },
        { expiresIn: '15d' }
      );

      // Lưu token mới vào cơ sở dữ liệu
      await this.authService.saveToken(user.id, newToken);

      return newToken;
    } catch (error) {
      throw new UnauthorizedException('Không thể làm mới token');
    }
  }
}
