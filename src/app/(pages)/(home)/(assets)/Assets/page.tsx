"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AssetModel {
  assetID: number;
  name: string;
  code: string;
  currency: string;
  position: string;
  price: number;
  unit: string;
  status: string;
}

const AssetsPage = () => {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 🔥 Màu chính Pastel
  const mainPastelColor = "#a0c4ff"; // Xanh pastel chủ đạo
  const mainPastelHoverColor = "#b8cffc";
  const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ
  const deletePastelColor = "#ffadad"; // Hồng pastel cho Delete

  // Helper để xác định màu Chip dựa trên Status
  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "active":
        return { backgroundColor: "#caffbf", color: "#1f5700" }; // Xanh mint
      case "in use":
      case "assigned":
        return { backgroundColor: "#ffd6a5", color: "#7d4600" }; // Cam nhạt
      case "maintenance":
      case "broken":
      case "retired":
        return { backgroundColor: deletePastelColor, color: "#610000" }; // Hồng/Đỏ nhạt
      default:
        return { backgroundColor: "#f0f0f0", color: "#4a4a4a" };
    }
  };

  // Load assets
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setAssets(res.data.data || []);
    } catch (err) {
      console.log(err);
      // alert("Cannot load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Open confirm modal
  const handleOpenConfirm = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  // DELETE
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Asset deleted");
      handleCloseConfirm();
      fetchAssets();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // Edit
  const handleEdit = (id: number) => {
    router.push(`/EditAssets?id=${id}`);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#fcfcfc",
        }}
      >
        <CircularProgress sx={{ color: mainPastelColor }} />
        <Typography variant="h6" sx={{ ml: 2, color: mainPastelTextColor }}>
          Loading Sweetness...
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        background: "#fcfcfc",
        // 🔥 Giảm padding container ngoài từ 4 (32px) xuống 3 (24px)
        padding: { xs: 2, sm: 3, md: 3 },
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // 🔥 Giảm mb từ 4 (32px) xuống 3 (24px)
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: mainPastelTextColor,
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          Assets Management
        </Typography>

        {/* ADD ASSET BUTTON - STYLE PASTEL NỔI BẬT */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("CreateAssets")}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            paddingX: 3,
            // 🔥 Giảm paddingY từ 1.2 xuống 1
            paddingY: 1,
            fontSize: "0.95rem", // Giảm font size nhẹ

            background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
            color: mainPastelTextColor,

            boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",

            "&:hover": {
              background: `linear-gradient(145deg, ${mainPastelColor}, ${mainPastelHoverColor})`,
              boxShadow: "0 8px 20px rgba(160, 196, 255, 0.6)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease-in-out",
          }}
        >
          Add New Asset
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e0e7f2",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "#f0f4ff", // Xanh nhạt tinh tế cho Header
              }}
            >
              {[
                "#",
                "Name",
                "Code",
                "Currency",
                "Position",
                "Price",
                "Unit",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 700,
                    color: "#5c677d",
                    fontSize: "0.9rem",
                    textAlign: header === "Actions" ? "center" : "left",
                    // 🔥 Giảm padding TH
                    padding: "10px 8px",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    No assets found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assets.map((item, index) => {
                const statusStyle = getStatusChipColor(item.status);
                return (
                  <TableRow
                    key={item.assetID}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" },
                      "&:hover td": {
                        backgroundColor: "#eef2ff",
                        transition: "0.2s",
                      },
                    }}
                  >
                    {/* 🔥 Giảm padding TD */}
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        padding: "8px 8px",
                      }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {item.code}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {item.currency}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {item.position}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {/* Format price to 2 decimal places */}
                      {item.price.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell sx={{ color: "#333", padding: "8px 8px" }}>
                      {item.unit}
                    </TableCell>

                    {/* STATUS CHIP */}
                    <TableCell sx={{ padding: "8px 8px" }}>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          ...statusStyle,
                          minWidth: 90,
                        }}
                      />
                    </TableCell>

                    <TableCell align="center" sx={{ padding: "8px 8px" }}>
                      {/* EDIT ICON */}
                      <IconButton
                        onClick={() => handleEdit(item.assetID)}
                        title="Edit"
                        size="small" // 🔥 Giảm kích thước icon button
                        sx={{ color: "#ffd6a5" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      {/* DELETE ICON */}
                      <IconButton
                        onClick={() => handleOpenConfirm(item.assetID)}
                        title="Delete"
                        size="small" // 🔥 Giảm kích thước icon button
                        sx={{ color: deletePastelColor }}
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

      {/* DELETE CONFIRM MODAL - STYLE PASTEL */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle sx={{ color: deletePastelColor, fontWeight: 700 }}>
          <DeleteIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography color="#4a4a4a">
            Are you sure you want to delete this asset? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseConfirm}
            variant="outlined"
            sx={{ color: "#6a798a" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            autoFocus
            sx={{
              backgroundColor: deletePastelColor, // Hồng Pastel
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
};

export default AssetsPage;
