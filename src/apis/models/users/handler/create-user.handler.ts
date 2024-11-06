// src/user/commands/create-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { UnauthorizedException } from '@nestjs/common';
import { hashPassWords } from 'src/utils/hashPass.untils';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userService: UsersService
    ) { }

    async execute(command: CreateUserCommand) {
        const { user } = command;


        await this.userService.checkExistEmail(user?.email)

        // throw new UnauthorizedException('Email đã tồn tại');
        const hashPassword = await hashPassWords(user.password)
        const newUser = await this.userRepository.create(
            { ...user, id: uuidv4(), password: hashPassword });

        return this.userRepository.save(newUser)
    }
}
