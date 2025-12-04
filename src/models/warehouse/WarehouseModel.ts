export interface WarehouseModel {
  warehouseID: number;
  name: string;
  description: string;
  address: string;
  createdDate: string;
  latitude: number;
  longitude: number;
  assets: any;
  managers: Manager[];
  requestReportForms: any;
  assetMovementsFrom: any;
  assetMovementsTo: any;
}

export interface Manager {
  id: number;
  warehouseID: number;
  warehouse: any;
  userID: number;
  user: any;
}

export interface AddWarehouseModel {
  name: string;
  description: string;
  address: string;
  createdDate: string;
  latitude: number;
  longitude: number;
  managerUserIds: number[];
}
