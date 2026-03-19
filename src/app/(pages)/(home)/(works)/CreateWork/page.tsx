"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaPlus, FaClipboard, FaFileAlt, FaUser } from "react-icons/fa";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff"; // Xanh pastel
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

export default function CreateWork() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const [form, setForm] = useState({
    assetID: 0,
    name: "",
    dueDate: null as any,
    description: "",
    assignedUserID: 0,
    assignedStaffIds: [] as number[],
  });

  // GET ASSETS & ACCOUNTS CÙNG LÚC
  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    };

    Promise.all([
      axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
        config,
      ),
      axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        config,
      ),
    ])
      .then(([assetRes, accountRes]) => {
        setAssets(assetRes.data?.data || []);
        setAccounts(accountRes.data?.data || []);
      })
      .catch((err) => console.log("Fetch Error:", err));
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (form.assignedUserID === 0) {
      alert("Please select a user to assign this work!");
      return;
    }

    try {
      // ✨ FIX QUAN TRỌNG:
      // Ép assignedUserID vào mảng assignedStaffIds để Backend tạo record trong bảng Assignments
      const body = {
        assetID: Number(form.assetID),
        name: form.name,
        dueDate: form.dueDate ? dayjs(form.dueDate).toISOString() : null,
        description: form.description,
        assignedUserID: Number(form.assignedUserID),
        assignedStaffIds: [Number(form.assignedUserID)], // Đưa ID vào mảng để fix lỗi assignments rỗng
      };

      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work",
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      alert("Created successfully! User should now see this in their list.");
      router.push("/Works");
    } catch (err) {
      console.error(err);
      alert("Failed to create work. Check console for details.");
    }
  };

  // ================= STYLE PASTEL =================
  const styles: Record<string, any> = {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "40px",
      background: "#fcfcfc",
      minHeight: "100vh",
    },
    card: {
      width: "660px",
      background: "white",
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 8px 22px rgba(160, 196, 255, 0.15)",
      border: "1px solid #e0e7f2",
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
    title: {
      fontSize: "28px",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "10px",
      color: mainPastelTextColor,
    },
    field: { display: "flex", flexDirection: "column", gap: "8px" },
    label: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#5c677d",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    input: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`,
      fontSize: "15px",
      backgroundColor: "#f7f9fc",
      outline: "none",
    },
    select: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`,
      fontSize: "15px",
      background: "#f7f9fc",
      cursor: "pointer",
      outline: "none",
    },
    textarea: {
      height: "120px",
      padding: "12px 14px",
      fontSize: "15px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`,
      backgroundColor: "#f7f9fc",
      outline: "none",
    },
    btn: {
      padding: "14px",
      background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
      color: mainPastelTextColor,
      border: "none",
      borderRadius: "12px",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",
      transition: "all 0.3s ease",
    },
  };

  const dateTimePickerTextFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#f7f9fc",
      "& fieldset": { borderColor: mainPastelColor },
      "&:hover fieldset": { borderColor: mainPastelHoverColor },
      "&.Mui-focused fieldset": {
        borderColor: mainPastelColor,
        borderWidth: "2px",
      },
    },
    "& .MuiInputBase-input": { padding: "12px 14px", fontSize: "15px" },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Work</h2>

          {/* WORK NAME */}
          <div style={styles.field}>
            <label style={styles.label}>
              <FaClipboard /> Work Name
            </label>
            <input
              style={styles.input}
              placeholder="Enter work name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* ASSET SELECT */}
          <div style={styles.field}>
            <label style={styles.label}>
              <FaFileAlt /> Asset
            </label>
            <select
              style={styles.select}
              value={form.assetID}
              onChange={(e) => handleChange("assetID", Number(e.target.value))}
            >
              <option value={0}>-- Select Asset --</option>
              {assets.map((asset, index) => (
                <option
                  key={`asset-${asset.assetID || index}`}
                  value={asset.assetID}
                >
                  {index + 1}. {asset.name} — #{asset.code}
                </option>
              ))}
            </select>
          </div>

          {/* ASSIGN USER SELECT */}
          <div style={styles.field}>
            <label style={styles.label}>
              <FaUser /> Assign Responsible Staff
            </label>
            <select
              style={styles.select}
              value={form.assignedUserID}
              onChange={(e) =>
                handleChange("assignedUserID", Number(e.target.value))
              }
            >
              <option value={0}>-- Select Staff --</option>
              {accounts.map((acc, index) => (
                <option key={`user-${acc.userID || index}`} value={acc.userID}>
                  {acc.username} ({acc.role})
                </option>
              ))}
            </select>
          </div>

          {/* DUE DATE */}
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <DateTimePicker
              value={form.dueDate}
              onChange={(value) => handleChange("dueDate", value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  sx: dateTimePickerTextFieldSx,
                },
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={styles.field}>
            <label style={styles.label}>
              <FaFileAlt /> Description
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Describe the work…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <button style={styles.btn} onClick={handleSubmit}>
            <FaPlus /> Create & Assign Work
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
