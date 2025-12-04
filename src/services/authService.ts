import { AuthModel, LoginRequest } from "../models/auth/LoginModel";
import axios from "axios";
import { SERVICE_API_URL } from "./service";

export class AuthService {
  static async login(loginData: LoginRequest) {
    console.log(loginData);
    const res = await axios.post(`${SERVICE_API_URL}/auth/login`, loginData);

    console.log(res);

    if (res.data.token && res.status === 200) {
      await localStorage.setItem("token", res.data.token);
      await localStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      return "fail";
    }

    return res;
  }
}
