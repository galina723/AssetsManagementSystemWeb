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
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AssetModel {
  assetID: number;
  warehouseID: number;
  name: string;
  code: string;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  status: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  totalQuantity: number;
  availableQuantity: number;
  latitude: number;
  longitude: number;
  isInWarehouse: boolean;
}

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

// Helper component for Modal rows
const DetailRow = ({
  label,
  value,
  color = "#2f3e46",
}: {
  label: string;
  value: any;
  color?: string;
}) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="caption"
      sx={{
        color: "#8e9aaf",
        fontWeight: 700,
        textTransform: "uppercase",
        display: "block",
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: value === "N/A" ? "#adb5bd" : color, fontWeight: 500 }}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

const AssetsPage = () => {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<AssetModel | null>(null);

  const getStatusChipColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
      case "active":
        return { backgroundColor: "#caffbf", color: "#1f5700" };
      case "in use":
      case "assigned":
        return { backgroundColor: "#ffd6a5", color: "#7d4600" };
      case "broken":
      case "retired":
        return { backgroundColor: deletePastelColor, color: "#610000" };
      default:
        return { backgroundColor: "#f0f0f0", color: "#4a4a4a" };
    }
  };

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
        },
      );
      setAssets(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenDetail = (asset: AssetModel) => {
    setViewingAsset(asset);
    setOpenDetail(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOpenConfirm(false);
      fetchAssets();
    } catch (err) {
      alert("Delete failed");
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
        <CircularProgress sx={{ color: mainPastelColor }} />
      </Box>
    );

  return (
    <Box
      sx={{
        background: "#fcfcfc",
        padding: { xs: 2, sm: 3 },
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: mainPastelTextColor }}
        >
          Assets Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("CreateAssets")}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            paddingX: 3,
            background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
            color: mainPastelTextColor,
            textTransform: "none",
            boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",
          }}
        >
          Add New Asset
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "16px", border: "1px solid #e0e7f2" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f0f4ff" }}>
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
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 700,
                    color: "#5c677d",
                    padding: "10px 8px",
                  }}
                  align={h === "Actions" ? "center" : "left"}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((item, index) => (
              <TableRow
                key={item.assetID}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" },
                  "&:hover td": { backgroundColor: "#eef2ff" },
                }}
              >
                <TableCell sx={{ padding: "8px" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500, padding: "8px" }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ padding: "8px" }}>{item.code}</TableCell>
                <TableCell sx={{ padding: "8px" }}>{item.currency}</TableCell>
                <TableCell sx={{ padding: "8px" }}>{item.position}</TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  {item.price?.toLocaleString()}
                </TableCell>
                <TableCell sx={{ padding: "8px" }}>{item.unit}</TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      ...getStatusChipColor(item.status),
                      minWidth: 80,
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ padding: "8px" }}>
                  <IconButton
                    onClick={() => handleOpenDetail(item)}
                    size="small"
                    sx={{ color: mainPastelColor }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      router.push(`/EditAssets?id=${item.assetID}`)
                    }
                    size="small"
                    sx={{ color: "#ffd6a5" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedId(item.assetID);
                      setOpenConfirm(true);
                    }}
                    size="small"
                    sx={{ color: deletePastelColor }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DETAIL MODAL */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: mainPastelTextColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Asset Specifications
          {viewingAsset && (
            <Chip
              label={viewingAsset.status}
              sx={{
                ...getStatusChipColor(viewingAsset.status),
                fontWeight: 700,
              }}
            />
          )}
        </DialogTitle>
        <Divider sx={{ mx: 3 }} />
        <DialogContent>
          {viewingAsset && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <Box sx={{ gridColumn: "span 3" }}>
                <DetailRow
                  label="Asset Name"
                  value={viewingAsset.name}
                  color={mainPastelTextColor}
                />
              </Box>
              <DetailRow label="Code" value={viewingAsset.code} />
              <DetailRow label="Owner" value={viewingAsset.owner} />
              <DetailRow label="Supplier" value={viewingAsset.supplier} />

              <Box sx={{ gridColumn: "span 3" }}>
                <Divider sx={{ my: 1 }} />
              </Box>

              <DetailRow
                label="Purchase Date"
                value={
                  viewingAsset.dateOfPurchase
                    ? new Date(viewingAsset.dateOfPurchase).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailRow
                label="Price"
                value={`${viewingAsset.price} ${viewingAsset.currency}`}
              />
              <DetailRow label="Unit" value={viewingAsset.unit} />

              <DetailRow label="Total Qty" value={viewingAsset.totalQuantity} />
              <DetailRow
                label="Available"
                value={viewingAsset.availableQuantity}
              />
              <DetailRow
                label="Warranty"
                value={`${viewingAsset.warrantyDuration} Months`}
              />

              <Box sx={{ gridColumn: "span 3" }}>
                <Divider sx={{ my: 1 }} />
              </Box>

              <Box sx={{ gridColumn: "span 2" }}>
                <DetailRow label="Position" value={viewingAsset.position} />
              </Box>
              <DetailRow
                label="Warranty Dept"
                value={viewingAsset.warrantyDepartment}
              />

              <Box sx={{ gridColumn: "span 3" }}>
                <DetailRow label="Purpose" value={viewingAsset.purpose} />
              </Box>
              <Box sx={{ gridColumn: "span 3" }}>
                <DetailRow
                  label="Note"
                  value={viewingAsset.note || "No additional notes"}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDetail(false)}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: mainPastelColor,
              color: mainPastelTextColor,
              fontWeight: 700,
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            Close Asset Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ color: deletePastelColor, fontWeight: 700 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Delete this asset? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{ backgroundColor: deletePastelColor, color: "#610000" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetsPage;
