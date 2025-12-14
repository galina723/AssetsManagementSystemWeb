"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

interface NotificationModel {
  notificationID: number;
  userID: number;
  actorUserId: number;
  type: number;
  entityType: string;
  entityID: number;
  title: string;
  description: string;
  createdDate: string;
  isRead: boolean;
}

const NotificationPage = () => {
  const [list, setList] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔥 token phải lấy tại đây!

      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("DATA:", res.data);
      setList(res.data?.data || []);
    } catch (e) {
      console.log("Notification load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleString();

  const getTypeColor = (type: number) => {
    switch (type) {
      case 0:
        return "#2563eb"; // blue
      case 1:
        return "#059669"; // green
      case 2:
        return "#f59e0b"; // yellow
      case 3:
        return "#dc2626"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div style={{ padding: 24, background: "#f3f4f6", minHeight: "100vh" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Notifications</h2>

      {loading ? (
        <div style={{ marginTop: 40 }}>
          <CircularProgress />
        </div>
      ) : list.length === 0 ? (
        <div style={{ marginTop: 30, fontSize: 18 }}>No notifications</div>
      ) : (
        list.map((item) => (
          <Card
            key={item.notificationID}
            sx={{
              marginTop: 2,
              background: "#ffffff",
              borderLeft: `6px solid ${getTypeColor(item.type)}`,
              boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 17, fontWeight: 700, color: "#111827" }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{ marginTop: 0.5, fontSize: 15, color: "#374151" }}
              >
                {item.description}
              </Typography>

              <Typography
                sx={{
                  marginTop: 1,
                  fontSize: 13,
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                {formatDate(item.createdDate)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
