"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SaveIcon from "@mui/icons-material/Save"; // Thêm icon Save

const CreateAssetsPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    code: "",
    position: "",
    dateOfPurchase: "",
    price: "",
    unit: "",
    currency: "",
    note: "",
    purpose: "",
    supplier: "",
    quantity: "",
    warrantyDuration: "",
    warrantyDepartment: "",
    latitude: "",
    longitude: "",
  });

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Đảm bảo tất cả các trường số được parse đúng cách, nếu không phải số thì set là 0
      const parseNumber = (value: string) =>
        isNaN(Number(value)) ? 0 : Number(value);

      const body = {
        ...form,
        code: parseNumber(form.code),
        price: parseNumber(form.price),
        quantity: parseNumber(form.quantity),
        warrantyDuration: parseNumber(form.warrantyDuration),
        latitude: parseNumber(form.latitude),
        longitude: parseNumber(form.longitude),
        dateOfPurchase: form.dateOfPurchase
          ? new Date(form.dateOfPurchase).toISOString()
          : null, // Xử lý trường ngày
      };

      const res = await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Asset created successfully!");
      router.push("/Assets");
    } catch (err) {
      console.log(err);
      alert("Create asset failed!");
    }
  };

  return (
    <div style={pastelStyles.page}>
      <div style={pastelStyles.header}>
        <h1 style={pastelStyles.title}> Create New Asset</h1>

        {/* SAVE BUTTON - Dùng style Pastel Nổi bật */}
        <button style={pastelStyles.saveBtn} onClick={handleSave}>
          <SaveIcon style={pastelStyles.saveIcon} />
          Save Asset
        </button>
      </div>

      {/* Form Container */}
      <div style={pastelStyles.card}>
        <div style={pastelStyles.formGrid}>
          {/** LEFT COLUMN */}
          <div style={pastelStyles.column}>
            <Input
              label="Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />
            <Input
              label="Code"
              value={form.code}
              onChange={(v) => updateField("code", v)}
            />
            <Input
              label="Position"
              value={form.position}
              onChange={(v) => updateField("position", v)}
            />
            <Input
              label="Date of Purchase"
              type="date"
              value={form.dateOfPurchase}
              onChange={(v) => updateField("dateOfPurchase", v)}
            />
            <Input
              label="Price"
              value={form.price}
              onChange={(v) => updateField("price", v)}
            />
            <Input
              label="Unit"
              value={form.unit}
              onChange={(v) => updateField("unit", v)}
            />
            <Input
              label="Currency"
              value={form.currency}
              onChange={(v) => updateField("currency", v)}
            />
          </div>

          {/** RIGHT COLUMN */}
          <div style={pastelStyles.column}>
            <Input
              label="Purpose"
              value={form.purpose}
              onChange={(v) => updateField("purpose", v)}
            />
            <Input
              label="Supplier"
              value={form.supplier}
              onChange={(v) => updateField("supplier", v)}
            />
            <Input
              label="Quantity"
              value={form.quantity}
              onChange={(v) => updateField("quantity", v)}
            />
            <Input
              label="Warranty Duration"
              value={form.warrantyDuration}
              onChange={(v) => updateField("warrantyDuration", v)}
            />
            <Input
              label="Warranty Department"
              value={form.warrantyDepartment}
              onChange={(v) => updateField("warrantyDepartment", v)}
            />
            <Input
              label="Latitude"
              value={form.latitude}
              onChange={(v) => updateField("latitude", v)}
            />
            <Input
              label="Longitude"
              value={form.longitude}
              onChange={(v) => updateField("longitude", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetsPage;

const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
}) => (
  <div style={pastelStyles.inputGroup}>
    <label style={pastelStyles.label}>{label}</label>
    <input
      style={pastelStyles.input}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// ============================
// 🔥 PASTE L STYLE
// ============================
const mainPastelColor = "#a0c4ff"; // Xanh pastel
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

const pastelStyles: any = {
  page: {
    padding: "32px",
    background: "#fcfcfc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px", // Tăng khoảng cách
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: mainPastelTextColor,
    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  card: {
    background: "white",
    padding: "40px", // Tăng padding
    borderRadius: "16px", // Bo góc mềm mại
    boxShadow: "0 4px 16px rgba(160, 196, 255, 0.1)", // Shadow pastel nhẹ
    border: "1px solid #e0e7f2",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px", // Tăng gap lớn hơn cho thoáng
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Tăng gap giữa các input
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#5c677d", // Màu label dịu nhẹ
  },
  input: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: `1px solid ${mainPastelColor}`, // Border màu pastel
    backgroundColor: "#f7f9fc", // Nền input màu sáng
    fontSize: "15px",
    color: "#333",
    transition: "0.2s",
    "&:focus": {
      outline: "none",
      borderColor: mainPastelHoverColor,
      boxShadow: "0 0 0 3px rgba(160, 196, 255, 0.5)", // Focus shadow
    },
  },
  saveBtn: {
    // Style Pastel Nổi bật
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 700,
    borderRadius: "12px",
    padding: "14px 30px",
    fontSize: "1rem",

    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    color: mainPastelTextColor,

    boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",
    border: "none",
    cursor: "pointer",

    // Đặt ngoài lưới/sau header
    marginLeft: "auto",
    transition: "all 0.3s ease-in-out",

    "&:hover": {
      background: `linear-gradient(145deg, ${mainPastelColor}, ${mainPastelHoverColor})`,
      boxShadow: "0 8px 20px rgba(160, 196, 255, 0.6)",
      transform: "translateY(-1px)",
    },
  },
  saveIcon: {
    fontSize: 20,
  },
};
