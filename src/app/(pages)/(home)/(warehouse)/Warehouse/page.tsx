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
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  assets?: any[] | null;
  managers?: any[] | null;
}

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

// Helper to handle "null" or empty values
const formatValue = (val: any) => {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    (Array.isArray(val) && val.length === 0)
  ) {
    return (
      <Typography
        component="span"
        sx={{ color: "#adb5bd", fontStyle: "italic" }}
      >
        No data available
      </Typography>
    );
  }
  return val;
};

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      sx={{ color: "#8e9aaf", fontWeight: 700, textTransform: "uppercase" }}
    >
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>{formatValue(value)}</Box>
  </Box>
);

const WarehousePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  // States for Detail Modal
  const [openDetail, setOpenDetail] = useState(false);
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(
    null,
  );

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
        },
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

  const handleShowDetail = (w: Warehouse) => {
    setViewingWarehouse(w);
    setOpenDetail(true);
  };

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
        },
      );
      setOpenDelete(false);
      setSelectedId(null);
      fetchWarehouses();
    } catch (e) {
      console.log("Delete error:", e);
    }
    setLoadingDelete(false);
  };

  const tableHeaderStyle = {
    fontWeight: 700,
    fontSize: "0.95rem",
    background: "#f0f4ff",
    color: "#5c677d",
  };

  const rowStyle = {
    "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" },
    "&:hover": { backgroundColor: "#eef2ff", cursor: "pointer" },
  };

  const tableHeaders = [
    "No.",
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
        padding: { xs: 2, sm: 3, md: 4 },
        background: "#fcfcfc",
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
          sx={{ fontWeight: 700, color: mainPastelTextColor }}
        >
          Warehouse List
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => router.push("CreateWarehouse")}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.2,
            background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
            color: mainPastelTextColor,
            textTransform: "none",
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: mainPastelColor }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "16px", border: "1px solid #e0e7f2" }}
        >
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header}
                    align={
                      ["No.", "Action", "Latitude", "Longitude"].includes(
                        header,
                      )
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
                  <TableCell sx={{ fontWeight: 500 }}>{w.name}</TableCell>
                  <TableCell>{w.description}</TableCell>
                  <TableCell>{w.address}</TableCell>
                  <TableCell align="center">{w.latitude}</TableCell>
                  <TableCell align="center">{w.longitude}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        title="Detail"
                        onClick={() => handleShowDetail(w)}
                        sx={{ color: mainPastelColor }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        title="Edit"
                        onClick={() => handleEdit(w.warehouseID.toString())}
                        sx={{ color: "#ffd6a5" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        title="Delete"
                        onClick={() => {
                          setSelectedId(w.warehouseID);
                          setOpenDelete(true);
                        }}
                        sx={{ color: deletePastelColor }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
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

      {/* DETAIL MODAL */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: mainPastelTextColor,
            backgroundColor: "#f8faff",
          }}
        >
          Warehouse Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          {viewingWarehouse && (
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
            >
              <Box sx={{ gridColumn: "span 2" }}>
                <DetailRow
                  label="Warehouse Name"
                  value={viewingWarehouse.name}
                />
              </Box>
              <Box sx={{ gridColumn: "span 2" }}>
                <DetailRow
                  label="Full Address"
                  value={viewingWarehouse.address}
                />
              </Box>
              <Box sx={{ gridColumn: "span 2" }}>
                <DetailRow
                  label="Description"
                  value={viewingWarehouse.description}
                />
              </Box>
              <DetailRow label="Latitude" value={viewingWarehouse.latitude} />
              <DetailRow label="Longitude" value={viewingWarehouse.longitude} />
              <DetailRow label="Managers" value={viewingWarehouse.managers} />
              <DetailRow label="Assets" value={viewingWarehouse.assets} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: "#f8faff" }}>
          <Button
            onClick={() => setOpenDetail(false)}
            variant="contained"
            sx={{
              backgroundColor: mainPastelColor,
              color: mainPastelTextColor,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Close Information
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: deletePastelColor, fontWeight: 700 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete this warehouse?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWarehouse}
            variant="contained"
            sx={{ backgroundColor: deletePastelColor, color: "#610000" }}
          >
            {loadingDelete ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehousePage;
