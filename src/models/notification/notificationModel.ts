export interface NotificationModel {
  notificationID: number;
  userID: number;
  user: any;
  actorUserId: number;
  actorUser: any;
  type: number;
  entityType: string;
  entityID: number;
  title: string;
  description: string;
  createdDate: string;
  isRead: boolean;
}
