"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff"; // Xanh pastel
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

// 🔥 Style cho TextField (Pastel) - Dùng cho các Input trong trang Add
const pastelTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f7f9fc", // Nền input màu sáng
    "& fieldset": {
      borderColor: mainPastelColor, // Border xanh pastel
    },
    "&:hover fieldset": {
      borderColor: mainPastelHoverColor, // Hover đậm hơn một chút
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
  });

  const setField = (k: string, v: any) =>
    setFormData((p) => ({ ...p, [k]: v }));

  // Load asset (giữ nguyên logic)
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
          // 🔥 Quantity đã được loại bỏ khi load data
          warrantyDuration: d.warrantyDuration ?? "",
          warrantyDepartment: d.warrantyDepartment ?? "",
          latitude: d.latitude ?? "",
          longitude: d.longitude ?? "",
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
      const parseNumber = (value: string) =>
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
        // 🔥 Quantity đã được loại bỏ khỏi payload
        warrantyDuration: parseNumber(formData.warrantyDuration),
        warrantyDepartment: formData.warrantyDepartment,
        latitude: parseNumber(formData.latitude),
        longitude: parseNumber(formData.longitude),
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
    <Box
      style={pastelStyles.page} // Dùng style page của Add Asset
    >
      {/* HEADER */}
      <Box style={pastelStyles.header}>
        <Box
          className="title-group"
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
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

        {/* SAVE BUTTON - STYLE PASTEL NỔI BẬT */}
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
            "&.Mui-disabled": {
              backgroundColor: mainPastelHoverColor,
              opacity: 0.7,
              color: mainPastelTextColor,
            },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>

      {/* FORM CARD - Bọc form trong Card style của Add Asset */}
      <Box style={pastelStyles.card}>
        <div style={pastelStyles.formGrid}>
          {/* Left col */}
          <div style={pastelStyles.column}>
            <AssetInput
              label="Asset Name"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <AssetInput
              label="Code"
              value={formData.code}
              onChange={(e) => setField("code", e.target.value)}
            />
            <AssetInput
              label="Position"
              value={formData.position}
              onChange={(e) => setField("position", e.target.value)}
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

            <AssetInput
              label="Price"
              value={formData.price}
              onChange={(e) => setField("price", e.target.value)}
            />
            <AssetInput
              label="Unit"
              value={formData.unit}
              onChange={(e) => setField("unit", e.target.value)}
            />
            <AssetInput
              label="Currency"
              value={formData.currency}
              onChange={(e) => setField("currency", e.target.value)}
            />
          </div>

          {/* Right col */}
          <div style={pastelStyles.column}>
            <AssetInput
              label="Purpose"
              value={formData.purpose}
              onChange={(e) => setField("purpose", e.target.value)}
            />
            <AssetInput
              label="Supplier"
              value={formData.supplier}
              onChange={(e) => setField("supplier", e.target.value)}
            />
            {/* 🔥 Quantity field removed */}
            <AssetInput
              label="Warranty Duration (months)"
              value={formData.warrantyDuration}
              onChange={(e) => setField("warrantyDuration", e.target.value)}
            />
            <AssetInput
              label="Warranty Department"
              value={formData.warrantyDepartment}
              onChange={(e) => setField("warrantyDepartment", e.target.value)}
            />
            <AssetInput
              label="Latitude"
              value={formData.latitude}
              onChange={(e) => setField("latitude", e.target.value)}
            />
            <AssetInput
              label="Longitude"
              value={formData.longitude}
              onChange={(e) => setField("longitude", e.target.value)}
            />
          </div>

          {/* Note - Full width field */}
        </div>
      </Box>
    </Box>
  );
};

export default EditAssetsPage;

// 🔥 Component Input sử dụng TextField MUI thay vì input HTML để style đồng nhất
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

// ============================
// 🔥 PASTEL STYLE ĐỒNG NHẤT VỚI TRANG ADD
// ============================

const pastelStyles: any = {
  page: {
    padding: "32px",
    background: "#fcfcfc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "30px", // Khoảng cách giữa header và card
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
  // Sử dụng layout cho Note tương tự như trang Add
  noteGroup: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};
