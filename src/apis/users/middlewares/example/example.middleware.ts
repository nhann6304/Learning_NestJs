import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../../users.service';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log("Duyệt qua Middleware ExampleMiddleware");
  }
}
