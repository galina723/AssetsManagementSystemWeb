// export interface LoginModel {
//   id: number;
//   username: string;
//   password: string;
// }

import {User} from '../user/UserModel';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
  expiresIn: number;
}

export interface Asset {
  assetID: number;
  name: string;
  code: number;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note?: string;
  status: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  quantity: number;
  availableQuantity: number;
  latitude?: number;
  longitude?: number;
  isInWarehouse?: boolean;
  warehouseID?: number;
}

export interface TestConnectionResult {
  success: boolean;
  status?: number;
  message?: string;
  data?: any;
}

export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  token?: string;
  message?: string;
}

export interface AssetsResult {
  success: boolean;
  data?: Asset[];
  message?: string;
}

export interface AuthModel {
  success: boolean;
  token: string;
  user: User;
  expiresIn: number;
  message: string;
}
