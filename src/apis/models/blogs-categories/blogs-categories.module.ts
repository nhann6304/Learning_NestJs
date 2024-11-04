import { Module } from '@nestjs/common';
import { BlogsCategoriesService } from './blogs-categories.service';
import { BlogsCategoriesController } from './blogs-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsCategoryEntity } from './entities/blogs-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogsCategoryEntity])],
  controllers: [BlogsCategoriesController],
  providers: [BlogsCategoriesService],
})
export class BlogsCategoriesModule { }
