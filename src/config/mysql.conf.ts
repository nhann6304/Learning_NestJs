import { TokenEntity } from 'src/apis/common/token/token.entity';
import { BlogsCategoryEntity } from 'src/apis/models/blogs-categories/entities/blogs-category.entity';
import { BlogsEntity } from 'src/apis/models/blogs/entities/blog.entity';
import { UserEntity } from 'src/apis/models/users/user.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const mysqlConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: +3306,
    username: 'root',
    password: 'root',
    database: 'test_2',
    entities: [UserEntity, TokenEntity, BlogsEntity, BlogsCategoryEntity],
    synchronize: true,
};
