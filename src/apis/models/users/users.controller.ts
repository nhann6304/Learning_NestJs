import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { MessagePattern, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';

@Controller('users')
@ApiTags('Test Api Users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    // @Post('create')
    // @ApiOperation({ summary: 'Tạo user' })
    // createUsers(@Body() userData: CreateUserDto) {
    //     return this.userService.createUsers(userData);
    // }

    // @Get()
    // @ApiOperation({ summary: 'Lấy all user' })
    // findAll() {
    //     return this.userService.findAll();
    // }

    // @Get(':id')
    // @ApiOperation({ summary: 'Tìm user theo id' })
    // getUserById(@Param('id') id: string) {
    //     console.log(id);
    //     return this.userService.findOneUser(id);
    // }

    // @Patch(':id')
    // @ApiOperation({ summary: 'Update user' })
    // updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    //     return this.userService.updateUser(id, payload);
    // }

    // @Delete(':id')
    // @ApiOperation({ summary: 'Xóa user' })
    // deleteUser(@Param('id') id: string) {
    //     return this.userService.deleteUser(id);
    // }

    @Post('create')
    @ApiOperation({ summary: 'Tạo user' })

    async create(
        @Body() userData: CreateUserDto,
        @Ctx() context: NatsStreamingContext,
    ) {
        return this.userService.createCqrs(userData, context);
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.queryBus.execute(new GetUserQuery(id));
    }
}
