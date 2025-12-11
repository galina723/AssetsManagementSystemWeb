"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
      const body = {
        ...form,
        code: Number(form.code),
        price: Number(form.price),
        quantity: Number(form.quantity),
        warrantyDuration: Number(form.warrantyDuration),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        dateOfPurchase: new Date(form.dateOfPurchase).toISOString(),
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
    <div style={styles.page}>
      <h1 style={styles.title}>Create Asset</h1>

      {/* Form Container */}
      <div style={styles.formGrid}>
        {/** LEFT COLUMN */}
        <div style={styles.column}>
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
          <Input
            label="Note"
            value={form.note}
            onChange={(v) => updateField("note", v)}
          />
        </div>

        {/** RIGHT COLUMN */}
        <div style={styles.column}>
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

      {/* SAVE BUTTON */}
      <button style={styles.saveBtn} onClick={handleSave}>
        Save Asset
      </button>
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
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input
      style={styles.input}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const styles: any = {
  page: {
    padding: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 600,
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  saveBtn: {
    marginTop: "26px",
    padding: "14px",
    backgroundColor: "#1976D2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "17px",
    cursor: "pointer",
    width: "200px",
  },
};
