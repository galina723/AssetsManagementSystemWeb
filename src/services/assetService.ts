import axios from "axios";
import {
  AddAssetModel,
  AssetDetailModel,
  AssignAssetModel,
  UpdateAssetModel,
} from "../models/asset/AssetModel";
import { connector, SERVICE_API_URL } from "./service";

export class AssetService {
  static async getAllAsset() {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${SERVICE_API_URL}/asset`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 200 ? res.data.data : "fail";
  }

  static async getAsset(id: number) {
    const res = await connector.get(`/asset/${id}`);

    if (res.status === 200) {
      return res.data.data as AssetDetailModel;
    } else {
      return "fail";
    }
  }

  static async addAsset(data: AddAssetModel) {
    const res = await connector.post("/asset", data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  static async updateAsset(data: UpdateAssetModel, id: number) {
    const res = await connector.put(`/asset/${id}`, data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  static async deleteAsset(id: number) {
    const res = await connector.delete(`/asset/${id}`);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  //   static async addAssetFile(id: number, attachment: DocumentPickerResponse) {
  //     const data = new FormData();
  //     data.append("file", attachment as any);

  //     const res = await connectorFile.post(`/asset/${id}/files`, data);

  //     if (res.status === 200) {
  //       return res;
  //     }

  //     return "fail";
  //   }

  static async assignAsset(data: AssignAssetModel) {
    const res = await connector.post("/asset/assign", data);

    if (res.status === 200) {
      return res;
    }

    return "fail";
  }

  // static async updateAsset(data: AssetModel, id: number) {
  //   const res = await connector.put(`/asset/${id}`, data);

  //   if (res.status === 200) {
  //     return res;
  //   }

  //   return 'fail';
  // }

  // static async deleteAsset(id: number) {
  //   const res = await connector.delete(`/asset/${id}`);

  //   if (res.status === 200) {
  //     return res;
  //   }

  //   return 'fail';
  // }
}
