import * as bcrypt from "bcrypt"

const saltRounds = 10; // Độ dài mật khẩu

// Mã hóa password
export const hashPassWords = async (password: string) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error("Có lỗi trong khi Hash Password")
    }
}

// Giải password đã hash
export const comparePassword = async (password: string, hashPassword: string,) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        throw new Error("Có lỗi trong quá trình phân giải Password");
    }
} 