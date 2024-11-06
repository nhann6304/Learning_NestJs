// src/user/queries/get-user.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    async execute(query: GetUserQuery) {
        const { id } = query;
        // Thực hiện logic để lấy người dùng
        console.log(`Getting user with id: ${id}`);
        return {}; // Trả về thông tin người dùng
    }
}
