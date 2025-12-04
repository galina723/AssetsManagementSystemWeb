import { User } from "../user/UserModel";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthModel {
  success: boolean;
  token: string;
  user: User;
  expiresIn: number;
  message: string;
}
