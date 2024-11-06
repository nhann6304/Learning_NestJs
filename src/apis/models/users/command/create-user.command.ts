// src/user/commands/create-user.command.ts
import { CreateUserDto } from '../user.dto';

export class CreateUserCommand {
    constructor(
        public readonly user: CreateUserDto) { }
}
