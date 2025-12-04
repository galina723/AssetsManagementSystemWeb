import { AuthModel, LoginRequest } from "../models/auth/LoginModel";
import axios from "axios";
import {
  AddWarehouseModel,
  WarehouseModel,
} from "../models/warehouse/WarehouseModel";
import { connector } from "@/helper/service/service";

export class WarehouseService {
  static async getAllWarehouse() {
    const res = await connector.get(`/warehouse`);

    if (res.status === 200) {
      return res.data.data as WarehouseModel[];
    } else {
      return "fail";
    }
  }

  static async getWarehouse(id: number) {
    const res = await connector.get(`/warehouse/${id}`);

    if (res.status === 200) {
      return res.data.data as WarehouseModel;
    } else {
      return "fail";
    }
  }

  static async addWarehouse(data: AddWarehouseModel) {
    const res = await connector.post("/warehouse", data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  static async updateWarehouse(data: AddWarehouseModel, id: number) {
    const res = await connector.put(`/warehouse/${id}`, data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  static async deleteWarehouse(id: number) {
    const res = await connector.delete(`/warehouse/${id}`);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }
}
