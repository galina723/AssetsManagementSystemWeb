"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Box,
  MenuItem, // Thêm MenuItem cho dropdown
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";

const pastelTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f7f9fc",
    "& fieldset": {
      borderColor: mainPastelColor,
    },
    "&:hover fieldset": {
      borderColor: mainPastelHoverColor,
    },
    "&.Mui-focused fieldset": {
      borderColor: mainPastelColor,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#5c677d",
  },
};

const EditAssetsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    position: "",
    dateOfPurchase: dayjs(),
    price: "",
    unit: "",
    currency: "",
    note: "",
    purpose: "",
    supplier: "",
    warrantyDuration: "",
    warrantyDepartment: "",
    latitude: "",
    longitude: "",
    status: 0, // Thêm mới
    isInWarehouse: true, // Thêm mới
  });

  const setField = (k: string, v: any) =>
    setFormData((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const d = res.data.data;

        setFormData({
          name: d.name ?? "",
          code: d.code ?? "",
          position: d.position ?? "",
          dateOfPurchase: d.dateOfPurchase ? dayjs(d.dateOfPurchase) : dayjs(),
          price: d.price ?? "",
          unit: d.unit ?? "",
          currency: d.currency ?? "",
          note: d.note ?? "",
          purpose: d.purpose ?? "",
          supplier: d.supplier ?? "",
          warrantyDuration: d.warrantyDuration ?? "",
          warrantyDepartment: d.warrantyDepartment ?? "",
          latitude: d.latitude ?? "",
          longitude: d.longitude ?? "",
          status: d.status ?? 0, // Load data mới
          isInWarehouse: d.isInWarehouse ?? true, // Load data mới
        });
      } catch (err) {
        console.error(err);
        alert("Không load được asset.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!id) return alert("Missing asset id");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const parseNumber = (value: any) =>
        isNaN(Number(value)) ? 0 : Number(value);

      const payload = {
        name: formData.name,
        code: parseNumber(formData.code),
        position: formData.position,
        dateOfPurchase: formData.dateOfPurchase
          ? (formData.dateOfPurchase as Dayjs).toISOString()
          : new Date().toISOString(),
        price: parseNumber(formData.price),
        unit: formData.unit,
        currency: formData.currency,
        note: formData.note,
        purpose: formData.purpose,
        supplier: formData.supplier,
        warrantyDuration: parseNumber(formData.warrantyDuration),
        warrantyDepartment: formData.warrantyDepartment,
        latitude: parseNumber(formData.latitude),
        longitude: parseNumber(formData.longitude),
        status: parseNumber(formData.status), // Gửi payload mới
        isInWarehouse: formData.isInWarehouse, // Gửi payload mới
      };

      await axios.put(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      alert("Updated successfully!");
      router.push("/Assets");
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <Box
        sx={{
          background: "#fcfcfc",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress sx={{ color: mainPastelColor }} />
        <Typography variant="h6" sx={{ ml: 2, color: mainPastelTextColor }}>
          Loading Asset Data...
        </Typography>
      </Box>
    );

  return (
    <Box style={pastelStyles.page}>
      <Box style={pastelStyles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => router.push("/Assets")}
            sx={{ color: mainPastelTextColor }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ margin: 0, fontWeight: 700, color: mainPastelTextColor }}
          >
            Edit Asset
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          disabled={saving}
          onClick={handleSave}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            paddingX: 3.5,
            paddingY: 1.4,
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
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>

      <Box style={pastelStyles.card}>
        <div style={pastelStyles.formGrid}>
          {/* Left col */}
          <div style={pastelStyles.column}>
            <AssetInput
              label="Asset Name"
              value={formData.name}
              onChange={(e: any) => setField("name", e.target.value)}
            />
            <AssetInput
              label="Code"
              value={formData.code}
              onChange={(e: any) => setField("code", e.target.value)}
            />

            {/* TRƯỜNG STATUS MỚI */}
            <Box style={pastelStyles.inputGroup}>
              <label style={pastelStyles.label}>Status</label>
              <TextField
                select
                value={formData.status}
                onChange={(e) => setField("status", e.target.value)}
                fullWidth
                size="small"
                sx={pastelTextFieldSx}
              >
                <MenuItem value={0}>Active (0)</MenuItem>
                <MenuItem value={1}>Maintenance (1)</MenuItem>
                <MenuItem value={2}>Broken (2)</MenuItem>
              </TextField>
            </Box>

            <AssetInput
              label="Position"
              value={formData.position}
              onChange={(e: any) => setField("position", e.target.value)}
            />

            <Box>
              <label style={pastelStyles.label}>Date of Purchase</label>
              <DatePicker
                value={formData.dateOfPurchase}
                onChange={(v) => setField("dateOfPurchase", v)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: pastelTextFieldSx,
                  },
                }}
              />
            </Box>
          </div>

          {/* Right col */}
          <div style={pastelStyles.column}>
            <AssetInput
              label="Price"
              value={formData.price}
              onChange={(e: any) => setField("price", e.target.value)}
            />

            {/* TRƯỜNG IN WAREHOUSE MỚI */}
            <Box style={pastelStyles.inputGroup}>
              <label style={pastelStyles.label}>In Warehouse</label>
              <TextField
                select
                value={formData.isInWarehouse.toString()}
                onChange={(e) =>
                  setField("isInWarehouse", e.target.value === "true")
                }
                fullWidth
                size="small"
                sx={pastelTextFieldSx}
              >
                <MenuItem value="true">True (In Stock)</MenuItem>
                <MenuItem value="false">False (Out of Stock)</MenuItem>
              </TextField>
            </Box>

            <AssetInput
              label="Supplier"
              value={formData.supplier}
              onChange={(e: any) => setField("supplier", e.target.value)}
            />
            <AssetInput
              label="Warranty Duration (months)"
              value={formData.warrantyDuration}
              onChange={(e: any) =>
                setField("warrantyDuration", e.target.value)
              }
            />
            <AssetInput
              label="Note"
              value={formData.note}
              onChange={(e: any) => setField("note", e.target.value)}
            />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default EditAssetsPage;

const AssetInput = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div style={pastelStyles.inputGroup}>
    <label style={pastelStyles.label}>{label}</label>
    <TextField
      value={value}
      type={type}
      onChange={onChange}
      fullWidth
      size="small"
      sx={pastelTextFieldSx}
    />
  </div>
);

const pastelStyles: any = {
  page: {
    padding: "32px",
    background: "#fcfcfc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(160, 196, 255, 0.1)",
    border: "1px solid #e0e7f2",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#5c677d",
  },
};
