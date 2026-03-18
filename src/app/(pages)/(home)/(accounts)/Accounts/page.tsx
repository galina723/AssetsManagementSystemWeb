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
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

const roleMap: {
  [key: string]: { name: string; pastelColor: string; textColor: string };
} = {
  Admin: { name: "Admin", pastelColor: "#ffadad", textColor: "#610000" },
  GeneralManager: {
    name: "General Manager",
    pastelColor: "#ffd6a5",
    textColor: "#7d4600",
  },
  AssetsManager: {
    name: "Assets Manager",
    pastelColor: "#a0c4ff",
    textColor: "#003b80",
  },
  WarehouseManager: {
    name: "Warehouse Manager",
    pastelColor: "#caffbf",
    textColor: "#1f5700",
  },
  TechnicalStaff: {
    name: "Technical Staff",
    pastelColor: "#bdb2ff",
    textColor: "#3e008d",
  },
  Staff: { name: "Staff", pastelColor: "#ffc6ff", textColor: "#7f007f" },
};

export default function AccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const router = useRouter();

  const getRoleInfo = (role: string) => {
    return (
      roleMap[role] || {
        name: role,
        pastelColor: "#f0f0f0",
        textColor: "#4a4a4a",
      }
    );
  };

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
        },
      );
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsers(list);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleView = (user: any) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleAdd = () => router.push("/CreateAccount");
  const handleEdit = (id: string) => router.push(`/EditAccount?id=${id}`);

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
        },
      );
      setOpenDelete(false);
      fetchAPI();
    } catch (err) {
      console.log(err);
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
        }}
      >
        <CircularProgress size={30} sx={{ color: "#a0c4ff" }} />
      </Box>
    );

  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#4a4a4a" }}>
          Account List
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            fontWeight: 700,
            borderRadius: "8px",
            paddingX: 2,
            background: "linear-gradient(135deg, #a0c4ff 30%, #b8cffc 90%)",
            color: "#3d5a80",
            textTransform: "none",
          }}
        >
          Add Account
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          border: "1px solid #e0e7f2",
          boxShadow: "none",
        }}
      >
        <Table sx={{ minWidth: 800 }} size="small">
          <TableHead>
            <TableRow sx={{ background: "#f8faff" }}>
              {["#", "Email", "Full Name", "Department", "Role", "Actions"].map(
                (label, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: 700,
                      color: "#5c677d",
                      padding: "8px 12px", // Giảm padding header
                      fontSize: "0.85rem",
                    }}
                  >
                    {label}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u, index) => (
              <TableRow
                key={u.userID}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fdfdfd" },
                  "&:hover": { backgroundColor: "#f0f4ff" },
                }}
              >
                <TableCell sx={{ padding: "6px 12px" }}>{index + 1}</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    padding: "6px 12px",
                    fontSize: "0.875rem",
                  }}
                >
                  {u.email}
                </TableCell>
                <TableCell sx={{ padding: "6px 12px", fontSize: "0.875rem" }}>
                  {u.fullName}
                </TableCell>
                <TableCell sx={{ padding: "6px 12px", fontSize: "0.875rem" }}>
                  {u.department}
                </TableCell>
                <TableCell sx={{ padding: "6px 12px" }}>
                  <Chip
                    label={getRoleInfo(u.role).name}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      height: "20px",
                      fontWeight: 600,
                      backgroundColor: getRoleInfo(u.role).pastelColor,
                      color: getRoleInfo(u.role).textColor,
                    }}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ padding: "4px 8px", whiteSpace: "nowrap" }}
                >
                  <IconButton
                    onClick={() => handleView(u)}
                    size="small"
                    sx={{ color: "#a0c4ff", p: 0.5 }}
                  >
                    <VisibilityIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEdit(u.userID.toString())}
                    size="small"
                    sx={{ color: "#ffd6a5", p: 0.5 }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(u.userID)}
                    size="small"
                    sx={{ color: "#ffadad", p: 0.5 }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL VIEW DETAIL */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        PaperProps={{ sx: { borderRadius: "12px", width: "360px" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#4a4a4a",
            textAlign: "center",
            bgcolor: "#f8faff",
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Account Details
        </DialogTitle>
        <DialogContent sx={{ mt: 1, px: 3, pb: 2 }}>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                {
                  label: "FULL NAME",
                  value: selectedUser.fullName,
                  bold: true,
                },
                { label: "EMAIL", value: selectedUser.email },
                { label: "PHONE", value: selectedUser.phone || "N/A" },
                { label: "DEPARTMENT", value: selectedUser.department },
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <Box sx={{ py: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#a0aec0",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: item.bold ? 600 : 400,
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                  {idx < 3 && <Divider />}
                </React.Fragment>
              ))}
              <Box sx={{ py: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#a0aec0",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                  }}
                >
                  ROLE
                </Typography>
                <Box sx={{ mt: 0.2 }}>
                  <Chip
                    label={getRoleInfo(selectedUser.role).name}
                    size="small"
                    sx={{
                      height: "22px",
                      fontSize: "0.75rem",
                      backgroundColor: getRoleInfo(selectedUser.role)
                        .pastelColor,
                      color: getRoleInfo(selectedUser.role).textColor,
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 1.5, justifyContent: "center", borderTop: "1px solid #eee" }}
        >
          <Button
            onClick={() => setOpenView(false)}
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#a0c4ff",
              color: "#FFF",
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              "&:hover": { bgcolor: "#b8cffc" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: "#ffadad", fontWeight: 700, py: 1.5 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <Typography variant="body2">
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setOpenDelete(false)} size="small">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#ffadad", textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
