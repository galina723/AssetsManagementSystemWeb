import { connector } from "@/helper/service/service";

export class NotificationService {
  static async getAllNotification() {
    const res = await connector.get(`/notification`);

    if (res.status === 200) {
      return res.data.data as unknown[];
    } else {
      return "fail";
    }
  }
}
