import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/apis/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const { email, password } = request.body;

    const user = await this.authService.validateUser({ email, password });
    if (user) {
      request.user = user; // Lưu thông tin người dùng vào request để có thể truy cập sau đó
      return true;
    } else {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
  }
}
