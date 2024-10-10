import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { IUser } from "src/interfaces/common/user.interface";
import { v4 as uuidv4 } from 'uuid';
export class CreateUserDto implements IUser {
    // @ApiProperty({ default: () => uuidv4() })
    id: string

    @ApiProperty({ type: String, default: "Nhân" })
    @IsNotEmpty({ message: "User name không được để trống" })
    userName: string;

    @ApiProperty({ type: String, default: "huynhthanhnhan632004@gmail.com" })
    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email sai định dạng" })
    email: string

    @IsNotEmpty({ message: "Tuổi không dược để trống" })
    @ApiProperty({ type: Number, default: 20 })
    age: number;

    @IsNotEmpty({ message: "Password không dược để trống" })
    @ApiProperty({ type: String, default: "thanhnhan" })
    password: string;

}

export class UpdateUserDto extends CreateUserDto implements IUser {
    userName: string;
    age: number;
    email: string;
    password: string;
}