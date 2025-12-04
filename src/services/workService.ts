import { AddWorkModel, WorkModel } from "../models/work/workModel";
import { connector } from "@/helper/service/service";

export class WorkService {
  static async getAllWork() {
    const res = await connector.get(`/work/get-work-createdList`);

    if (res.status === 200) {
      return res.data.data as WorkModel[];
    } else {
      return "fail";
    }
  }

  static async getWork(id: number) {
    const res = await connector.get(`/work/get-work-created/${id}`);

    if (res.status === 200) {
      return res.data.data as unknown;
    } else {
      return "fail";
    }
  }

  static async getWorkByID(id: number) {
    const res = await connector.get(`/work/${id}`);

    if (res.status === 200) {
      return res.data.data as unknown;
    } else {
      return "fail";
    }
  }

  static async addWork(data: AddWorkModel) {
    const res = await connector.post("/work", data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  // static async updateWork(data: UpdateWorkModel, id: number) {
  //   const res = await connector.put(`/work/${id}`, data);

  //   if (res.status === 200) {
  //     return res;
  //   }

  //   return 'fail';
  // }

  static async deleteWork(id: number) {
    const res = await connector.delete(`/work/${id}`);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }
}
