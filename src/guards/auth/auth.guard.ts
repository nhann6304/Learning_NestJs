import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor
    (
      private readonly jwtService: JwtService
    ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.cookies.token;
    if (token) {
      return true
    } else {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }
  }
}
