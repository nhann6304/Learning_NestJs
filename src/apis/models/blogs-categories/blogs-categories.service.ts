import { Injectable } from '@nestjs/common';
import { CreateBlogsCategoryDto } from './dto/create-blogs-category.dto';
import { UpdateBlogsCategoryDto } from './dto/update-blogs-category.dto';

@Injectable()
export class BlogsCategoriesService {
  create(createBlogsCategoryDto: CreateBlogsCategoryDto) {
    return 'This action adds a new blogsCategory';
  }

  findAll() {
    return `This action returns all blogsCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogsCategory`;
  }

  update(id: number, updateBlogsCategoryDto: UpdateBlogsCategoryDto) {
    return `This action updates a #${id} blogsCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogsCategory`;
  }
}
