import { connector } from "@/helper/service/service";
import { LoginRequest } from "@/models/auth/authModel";

export class AuthService {
  static async login(loginData: LoginRequest) {
    console.log(loginData);
    const res = await connector.post("/auth/login", loginData);

    if (res.data.token && res.status === 200) {
      await localStorage.setItem("token", res.data.token);
      await localStorage.setItem("user", res.data.name);
    } else {
      return "fail";
    }

    return res;
  }
}
