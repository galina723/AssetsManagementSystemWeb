"use client";

import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import { useDispatch } from "react-redux";
import axios from "axios";

interface Warehouse {
  warehouseID: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
}

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff"; // Xanh pastel
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ
const deletePastelColor = "#ffadad"; // Hồng pastel cho Delete

const WarehousePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm loading state

  // ================= GET WAREHOUSE LIST =================
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setWarehouses(res.data.data || []);
    } catch (e) {
      console.log("Fetch warehouse error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(addSidebar("warehouse"));
    fetchWarehouses();
  }, [dispatch]);

  const handleEdit = (id: string) => {
    router.push(`/EditWarehouse?id=${id}`);
  };

  // ================= DELETE WAREHOUSE =================
  const handleDeleteWarehouse = async () => {
    if (!selectedId) return;

    setLoadingDelete(true);
    try {
      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setOpenDelete(false);
      setSelectedId(null);
      fetchWarehouses();
    } catch (e) {
      console.log("Delete error:", e);
    }
    setLoadingDelete(false);
  };

  // ================= UI Styles =================
  const tableHeaderStyle = {
    fontWeight: 700,
    fontSize: "0.95rem",
    background: "#f0f4ff", // Xanh nhạt tinh tế
    color: "#5c677d", // Màu chữ dịu nhẹ
  };

  const rowStyle = {
    "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" }, // Sọc zebra siêu nhạt
    "&:hover": { backgroundColor: "#eef2ff", cursor: "pointer" }, // Hover xanh lavender
  };

  // ================= RENDER =================

  // Danh sách các cột hiển thị
  const tableHeaders = [
    "No.",
    // "Warehouse ID", 🔥 Đã bỏ
    "Name",
    "Description",
    "Address",
    "Latitude",
    "Longitude",
    "Action",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: 2, sm: 3, md: 4 }, // Tăng padding
        background: "#fcfcfc", // Nền Pastel
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: mainPastelTextColor,
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          Warehouse List
        </Typography>

        {/* ADD WAREHOUSE BUTTON - STYLE PASTEL NỔI BẬT */}
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => router.push("CreateWarehouse")}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.2,
            fontSize: "1rem",

            background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
            color: mainPastelTextColor,

            boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",

            "&:hover": {
              background: `linear-gradient(145deg, ${mainPastelColor}, ${mainPastelHoverColor})`,
              boxShadow: "0 8px 20px rgba(160, 196, 255, 0.6)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease-in-out",
            textTransform: "none",
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: mainPastelColor }} />
          <Typography variant="h6" sx={{ ml: 2, color: mainPastelTextColor }}>
            Loading data...
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(160, 196, 255, 0.15)",
            border: "1px solid #e0e7f2",
          }}
        >
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header}
                    align={
                      header === "No." ||
                      header === "Action" ||
                      header === "Latitude" ||
                      header === "Longitude"
                        ? "center"
                        : "left"
                    }
                    sx={tableHeaderStyle}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {warehouses.map((w, index) => (
                <TableRow key={w.warehouseID} sx={rowStyle}>
                  <TableCell align="center">{index + 1}</TableCell>
                  {/* <TableCell align="center">{w.warehouseID}</TableCell> 🔥 Đã bỏ */}
                  <TableCell sx={{ fontWeight: 500 }}>{w.name}</TableCell>
                  <TableCell>{w.description}</TableCell>
                  <TableCell>{w.address}</TableCell>
                  <TableCell align="center">{w.latitude}</TableCell>
                  <TableCell align="center">{w.longitude}</TableCell>

                  <TableCell align="center">
                    {/* EDIT BUTTON */}
                    <IconButton
                      title="Edit"
                      onClick={() => handleEdit(w.warehouseID.toString())}
                      sx={{ color: "#ffd6a5" }} // Vàng cam pastel
                    >
                      <EditIcon />
                    </IconButton>
                    {/* DELETE BUTTON */}
                    <IconButton
                      title="Delete"
                      onClick={() => {
                        setSelectedId(w.warehouseID);
                        setOpenDelete(true);
                      }}
                      sx={{ color: deletePastelColor }} // Hồng pastel
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination - Dùng Box để tách style khỏi TableContainer */}
      {!loading && (
        <Box
          sx={{
            mt: 2,
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={warehouses.length}
            rowsPerPage={5}
            page={0}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        </Box>
      )}

      {/* DELETE MODAL - STYLE PASTEL */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: deletePastelColor, fontWeight: 700 }}>
          <DeleteIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography color="#4a4a4a">
            Are you sure you want to delete this warehouse?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ textTransform: "none", color: "#6a798a" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDeleteWarehouse}
            disabled={loadingDelete}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              minWidth: "100px",
              backgroundColor: deletePastelColor, // Hồng Pastel
              color: "#610000",
              "&:hover": {
                backgroundColor: "#ff8c8c",
              },
            }}
          >
            {loadingDelete ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehousePage;
