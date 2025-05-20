import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateObjectIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID : ${id}`);
    }
    next();
  }
}
