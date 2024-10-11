export interface IJwtPayload {
    email: string;
    sub: string; // Là ID người dùng
    iat: number; // Thời gian tạo token
    exp: number; // Thời gian hết hạn token
}