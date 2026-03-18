// import { User } from "../user/UserModel";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthModel {
  success: boolean;
  token: string;
  user: any;
  expiresIn: number;
  message: string;
}
