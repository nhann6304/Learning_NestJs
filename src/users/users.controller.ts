import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('users')
@ApiTags("Test Api Users")
// @UseGuards(AuthGuard)
export class UsersController {

    constructor(private userService: UsersService) { }

    // @Get()
    // getUsers(@Query("sortBy") sortBy: string) {
    //     return { userName: "Nhân", email: "huynhthanhnhan632004@gmail.com" }
    // }



    @Post("create")
    @ApiOperation({ summary: "Tạo user" })
    createUsers(@Body() userData: CreateUserDto) {
        return this.userService.createUsers(userData)
    }

    @Get()
    @ApiOperation({ summary: "Lấy all user" })
    findAll() {
        return this.userService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: "Tìm user theo id" })
    getUserById(@Param('id') id: string) {
        return this.userService.findOneUser(id)
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update user" })
    updateUser(@Param("id") id: string, @Body() payload: UpdateUserDto) {
        return this.userService.updateUser(id, payload);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Xóa user" })
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }
}
