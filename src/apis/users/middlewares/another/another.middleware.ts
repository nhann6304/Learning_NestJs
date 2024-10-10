import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AnotherMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log("Duyệt qua Middleware thứ 2 ");
    next();
  }
}
