import {DynamicValue} from '../form/DynamicValue';
import {UserModel} from '../user/UserModel';

export const AssetStatusOptions: DynamicValue[] = [
  {label: 'Normal', value: 0},
  {label: 'In use', value: 1},
  {label: 'Broken', value: 2},
  {label: 'Recall', value: 3},
  {label: 'In repair', value: 4},
  {label: 'Lost', value: 5},
];

export enum CurrencyEnum {
  VND = 'VND',
  USD = 'USD',
}

export interface AssetModel {
  assetID: number;
  warehouseID: number;
  name: string;
  code: number;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  status: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  totalQuantity: number;
  availableQuantity: number;
  latitude: number;
  longitude: number;
  isInWarehouse: boolean;
}

export interface AssetDetailModel {
  assetID: number;
  warehouseID: number;
  name: string;
  code: number;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  status: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  totalQuantity: number;
  availableQuantity: number;
  latitude: number;
  longitude: number;
  isInWarehouse: boolean;
  files: any[];
}

export interface AddAssetModel {
  name: string;
  code: number;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  purpose: string;
  supplier: string;
  quantity: number;
  warrantyDuration: number;
  warrantyDepartment: string;
  latitude: number;
  longitude: number;
}

export interface UpdateAssetModel {
  warehouseID?: number;
  name: string;
  code: number;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  status: number;
  warrantyDepartment: string;
  latitude: number;
  longitude: number;
  isInWarehouse?: boolean;
}

export interface AssignAssetModel {
  assetID: number;
  userID: number;
  unit: number;
  assignedDate: string;
}
