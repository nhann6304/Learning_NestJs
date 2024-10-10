import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/interfaces/common/user.interface';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { create } from 'domain';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }


    async createUsers(createUserDto: CreateUserDto) {
        console.log(createUserDto);
        const newUser = await this.userRepository.create({ ...createUserDto, id: uuidv4() });
        return this.userRepository.save(newUser);
    }

    async findAll() {
        const users = await this.userRepository.find()
        const total = await this.userRepository.count()
        return { total, users };
    }


    async findOneUser(id: string) {
        const userFind = await this.userRepository.findOneBy({ id });
        if (userFind) {
            return userFind;
        } else {
            return {
                message: `Không tìm thấy User có id là ${id}`
            }
        }
    }

    async updateUser(id: string, payload: UpdateUserDto) {
        await this.userRepository.update(id, payload);
        return this.findOneUser(id)
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete(id)
        if (result.affected === 0) {
            throw new Error("Không tìm thấy User")
        } else {
            return {
                message: "Xóa user thành công",
            }
        }
    }

    async findByEmail(email: string): Promise<IUser> {
        const result = await this.userRepository.findOne({ where: { email } })
        if (result) {
            return result
        } else {
            throw new NotFoundException("User không tồn tại trong hệ thống");
        }
    }
}
