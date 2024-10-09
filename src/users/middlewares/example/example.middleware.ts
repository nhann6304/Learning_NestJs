import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Duyệt qua Middleware");
    if (req.body.userName === "Nhân") {
      throw new HttpException(`Tên ${req.body.userName} đã tồn tại`, HttpStatus.ACCEPTED)
    } else {
      next();
    }
  }
}
