// import { UserModel } from "../models/user/UserModel";
import { connector } from "@/helper/service/service";

export class AccountService {
  static async getAllAccount() {
    const res = await connector.get(`/account`);

    console.log(res);

    if (res.status === 200) {
      return res.data.data as any[];
    } else {
      return "fail";
    }
  }

  static async getAccount(id: number) {
    const res = await connector.get(`/account/${id}`);

    if (res.status === 200) {
      return res.data.data as any;
    } else {
      return "fail";
    }
  }
}
