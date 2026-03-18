import { connector } from "@/helper/service/service";
// import { UserModel } from "@/models/user/UserModel";

export class UserService {
  static async getAllUser() {
    const res = await connector.get(`/user`);

    if (res.status === 200) {
      return res.data.data as any[];
    } else {
      return "fail";
    }
  }

  static async getUser(id: number) {
    const res = await connector.get(`/user/${id}`);

    if (res.status === 200) {
      return res.data.data as any;
    } else {
      return "fail";
    }
  }

  // static async addUser(data: AddUserModel) {
  //   const res = await connector.post("/user", data);

  //   if (res.status === 200) {
  //     return res;
  //   }

  //   return "fail";
  // }

  // static async updateUser(data: AddUserModel, id: number) {
  //   const res = await connector.put(`/user/${id}`, data);

  //   if (res.status === 200) {
  //     return res;
  //   }

  //   return "fail";
  // }

  static async deleteUser(id: number) {
    const res = await connector.delete(`/user/${id}`);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }
}
