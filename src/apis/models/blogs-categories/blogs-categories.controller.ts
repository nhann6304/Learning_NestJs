import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogsCategoriesService } from './blogs-categories.service';
import { CreateBlogsCategoryDto } from './dto/create-blogs-category.dto';
import { UpdateBlogsCategoryDto } from './dto/update-blogs-category.dto';

@Controller('blogs-categories')
export class BlogsCategoriesController {
  constructor(private readonly blogsCategoriesService: BlogsCategoriesService) {}

  @Post()
  create(@Body() createBlogsCategoryDto: CreateBlogsCategoryDto) {
    return this.blogsCategoriesService.create(createBlogsCategoryDto);
  }

  @Get()
  findAll() {
    return this.blogsCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogsCategoryDto: UpdateBlogsCategoryDto) {
    return this.blogsCategoriesService.update(+id, updateBlogsCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsCategoriesService.remove(+id);
  }
}
