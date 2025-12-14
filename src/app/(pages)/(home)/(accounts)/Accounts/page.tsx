"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

// 🔥 Bảng ánh xạ Role với màu Pastel
const roleMap: {
  [key: string]: { name: string; pastelColor: string; textColor: string };
} = {
  Admin: { name: "Admin", pastelColor: "#ffadad", textColor: "#610000" }, // Hồng nhạt
  GeneralManager: {
    name: "General Manager",
    pastelColor: "#ffd6a5",
    textColor: "#7d4600",
  }, // Cam nhạt
  AssetsManager: {
    name: "Assets Manager",
    pastelColor: "#a0c4ff",
    textColor: "#003b80",
  }, // Xanh dương nhạt
  WarehouseManager: {
    name: "Warehouse Manager",
    pastelColor: "#caffbf",
    textColor: "#1f5700",
  }, // Xanh mint
  TechnicalStaff: {
    name: "Technical Staff",
    pastelColor: "#bdb2ff",
    textColor: "#3e008d",
  }, // Tím lavender
  Staff: { name: "Staff", pastelColor: "#ffc6ff", textColor: "#7f007f" }, // Tím hồng nhạt
};

export default function AccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  // Helper Function để lấy thông tin Role với màu pastel
  const getRoleInfo = (role: string) => {
    return (
      roleMap[role] || {
        name: role,
        pastelColor: "#f0f0f0",
        textColor: "#4a4a4a",
      }
    );
  };

  // 🔥 Fetch API (không đổi)
  const fetchAPI = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsers(list);
    } catch (err) {
      console.log("API ERROR:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // 🔥 Add / Edit / Delete Handlers (không đổi)
  const handleAdd = () => {
    router.push("/CreateAccount");
  };

  const handleEdit = (id: string) => {
    router.push(`/EditAccount?id=${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setOpenDelete(false);
      setSelectedId(null);
      fetchAPI();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#fcfcfc", // Nền loading cũng pastel
        }}
      >
        <CircularProgress sx={{ color: "#a0c4ff" }} /> {/* Màu xanh pastel */}
        <Typography variant="h6" sx={{ ml: 2, color: "#4a4a4a" }}>
          Loading Sweetness...
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        // 🔥 Giảm padding ngoài từ 4 (32px) xuống 3 (24px)
        padding: 3,
        display: "flex",
        flexDirection: "column",
        // 🔥 Giảm gap từ 4 (32px) xuống 3 (24px)
        gap: 3,
        minHeight: "100%",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: "#4a4a4a",
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          Account List
        </Typography>

        {/* Nút Add với màu Pastel */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            fontWeight: 700,
            borderRadius: "10px",
            // 🔥 Giảm padding Y từ 1.5 (12px) xuống 1 (8px)
            paddingX: 3,
            paddingY: 1,
            fontSize: "0.95rem", // Hơi giảm font size

            // Màu Xanh Pastel
            background: "linear-gradient(135deg, #a0c4ff 30%, #b8cffc 90%)",
            color: "#3d5a80",
            "&:hover": {
              background: "linear-gradient(135deg, #b8cffc 30%, #a0c4ff 90%)",
              boxShadow: "0 6px 15px rgba(160, 196, 255, 0.5)",
            },
            boxShadow: "0 4px 10px rgba(160, 196, 255, 0.4)",
          }}
        >
          Add New Account
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          overflow: "auto",
          border: "1px solid #e0e7f2",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow
              sx={{
                background: "#f0f4ff", // Xanh nhạt tinh tế cho Header
              }}
            >
              {/* CÁC TH/TD DÙNG MỘT HÀM STYLE RIÊNG ĐỂ DỄ QUẢN LÝ PADDING */}
              {[
                "#",
                "Email",
                "Full Name",
                "Department",
                "Phone",
                "Gender",
                "Role",
                "Actions",
              ].map((label, index) => (
                <TableCell
                  key={index}
                  align={label === "Actions" ? "center" : "left"}
                  sx={{
                    fontWeight: 700,
                    color: "#5c677d",
                    fontSize: "0.9rem", // Hơi giảm font
                    padding: "12px 10px", // 🔥 Giảm padding TH
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    No user accounts found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u, index) => {
                const roleInfo = getRoleInfo(u.role);
                return (
                  <TableRow
                    key={u.userID}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" },
                      "&:hover td": {
                        backgroundColor: "#eef2ff",
                        transition: "0.2s",
                      },
                    }}
                  >
                    {/* 🔥 Giảm Padding TD */}
                    <TableCell sx={{ color: "#333", padding: "10px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 500, color: "#333", padding: "10px" }}
                    >
                      {u.email}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "10px" }}>
                      {u.fullName}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "10px" }}>
                      {u.department}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "10px" }}>
                      {u.phone}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "10px" }}>
                      {u.gender}
                    </TableCell>

                    <TableCell sx={{ padding: "10px" }}>
                      {/* Chip với màu Pastel */}
                      <Chip
                        label={roleInfo.name}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          minWidth: 100, // Giảm minWidth chip
                          backgroundColor: roleInfo.pastelColor,
                          color: roleInfo.textColor,
                        }}
                      />
                    </TableCell>

                    <TableCell align="center" sx={{ padding: "10px" }}>
                      <IconButton
                        onClick={() => handleEdit(u.userID.toString())}
                        title="Edit"
                        size="small" // Giảm kích thước icon button
                        sx={{ color: "#ffd6a5" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDelete(u.userID)}
                        title="Delete"
                        size="small" // Giảm kích thước icon button
                        sx={{ color: "#ffadad" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DELETE POPUP (Không thay đổi style của Modal) */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: "#ffadad", fontWeight: 700 }}>
          <DeleteIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography color="#4a4a4a">
            You are about to delete an account. This action cannot be undone.
            <br />
            **Are you sure you want to proceed?**
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ color: "#6a798a" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={confirmDelete}
            autoFocus
            sx={{
              backgroundColor: "#ffadad", // Hồng Pastel
              color: "#610000",
              "&:hover": {
                backgroundColor: "#ff8c8c",
              },
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
