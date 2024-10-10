import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../../users.service';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {

  constructor(private userService: UsersService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log("Duyệt qua Middleware ExampleMiddleware");
    try {
      await this.userService.checkExistEmail(req.body.email);
      // Nếu email chưa tồn tại, tiếp tục
      next();
    } catch (error) {
      // Nếu có lỗi (email đã tồn tại), trả về lỗi
      next(error);
    }
  }
}
