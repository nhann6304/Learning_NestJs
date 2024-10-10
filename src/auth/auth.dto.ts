import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { IUser } from "src/interfaces/common/user.interface";

export class LoginDto implements Pick<IUser, "email" | "password"> {

    // id: string;

    @IsEmail({}, { message: "Email không đúng định dạng" })
    @ApiProperty({ default: "huynhthanhnhan632004@gmail.com" })
    email: string;

    @ApiProperty({ default: "thanhnhan" })
    password: string;
}