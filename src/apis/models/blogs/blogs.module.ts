import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/apis/common/token/token.entity';
import { BlogsEntity } from './entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogsEntity])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule { }
