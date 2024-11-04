import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogsCategoryDto } from './create-blogs-category.dto';

export class UpdateBlogsCategoryDto extends PartialType(CreateBlogsCategoryDto) {}
