export interface WorkModel {
  workID: number;
  createBy: number;
  creator: any;
  assetID: number;
  asset: any;
  name: string;
  createdDate: string;
  dueDate: string;
  status: number;
  description: string;
  assignments: any;
}

export interface AddWorkModel {
  assetID: number;
  name: string;
  dueDate: string;
  description: string;
  assignedUserID?: number;
  assignedStaffIds: number[];
}
