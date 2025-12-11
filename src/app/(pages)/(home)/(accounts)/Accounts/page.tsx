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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  // 🔥 Role hiển thị đẹp hơn
  const roleList = [
    { key: "Admin", name: "Admin" },
    { key: "GeneralManager", name: "General Manager" },
    { key: "AssetsManager", name: "Assets Manager" },
    { key: "WarehouseManager", name: "Warehouse Manager" },
    { key: "Staff", name: "Staff" },
    { key: "TechnicalStaff", name: "Technical Staff" },
  ];

  const getRoleName = (role: string) => {
    const f = roleList.find((x) => x.key === role);
    return f ? f.name : role;
  };

  // 🔥 Fetch API
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

  // 🔥 Add
  const handleAdd = () => {
    router.push("/CreateAccount");
  };

  // 🔥 Edit
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
      <div style={{ padding: 20, textAlign: "center", fontSize: 18 }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          Account List
        </h2>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            fontWeight: 600,
            borderRadius: "8px",
            paddingX: 2.5,
            paddingY: 1,
          }}
        >
          Add Account
        </Button>
      </div>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "#f3f4f6",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              users.map((u, index) => (
                <TableRow
                  key={u.userID}
                  sx={{
                    "&:hover td": { background: "#f9fafb" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.department}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.gender}</TableCell>

                  <TableCell>{getRoleName(u.role)}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(u.userID.toString())}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(u.userID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DELETE POPUP */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this account?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
