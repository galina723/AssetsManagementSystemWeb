"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaPlus, FaClipboard, FaFileAlt } from "react-icons/fa";

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
  const [form, setForm] = useState({
    assetID: 0,
    name: "",
    dueDate: null as any,
    description: "",
  });

  // GET ASSETS (Logic không đổi)
  useEffect(() => {
    axios
      .get("https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => setAssets(res.data?.data || []))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const body = {
        ...form,
        dueDate: form.dueDate ? dayjs(form.dueDate).toISOString() : null,
      };

      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work",
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Created successfully!");
      router.push("/Works");
    } catch (err) {
      console.log(err);
      alert("Failed to create work");
    }
  };

  // ================= STYLE PASTEL =================
  const styles: Record<string, any> = {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "40px", // Tăng padding
      background: "#fcfcfc", // Nền Pastel
      minHeight: "100vh",
    },
    card: {
      width: "660px", // Rộng hơn
      background: "white",
      padding: "40px", // Tăng padding
      borderRadius: "16px",
      // Shadow Pastel nhẹ
      boxShadow: "0 8px 22px rgba(160, 196, 255, 0.15)",
      border: "1px solid #e0e7f2",
      display: "flex",
      flexDirection: "column",
      gap: "28px", // Tăng gap
    },
    title: {
      fontSize: "28px", // Tăng size
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "10px",
      letterSpacing: "0.5px",
      color: mainPastelTextColor, // Màu text Pastel
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px", // Tăng gap
    },
    label: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#5c677d", // Màu label Pastel
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    input: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`, // Border Pastel
      fontSize: "15px",
      transition: "0.2s",
      backgroundColor: "#f7f9fc",
      outline: "none",
      "&:focus": {
        borderColor: mainPastelHoverColor,
        boxShadow: `0 0 0 2px ${mainPastelColor}80`,
      },
    },
    select: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`,
      fontSize: "15px",
      background: "#f7f9fc",
      cursor: "pointer",
      color: "#333",
      outline: "none",
      appearance: "none", // Bỏ style default của browser
    },
    textarea: {
      height: "120px", // Tăng chiều cao
      padding: "12px 14px",
      fontSize: "15px",
      borderRadius: "10px",
      border: `1px solid ${mainPastelColor}`,
      resize: "vertical",
      backgroundColor: "#f7f9fc",
      outline: "none",
      "&:focus": {
        borderColor: mainPastelHoverColor,
        boxShadow: `0 0 0 2px ${mainPastelColor}80`,
      },
    },
    // Style cho nút Submit (Pastel Nổi bật)
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
      marginTop: "10px",
      boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",
      transition: "all 0.3s ease-in-out",

      "&:hover": {
        background: `linear-gradient(145deg, ${mainPastelColor}, ${mainPastelHoverColor})`,
        boxShadow: "0 8px 20px rgba(160, 196, 255, 0.6)",
        transform: "translateY(-1px)",
      },
    },
  };

  // 🔥 Định nghĩa style cho DatePicker TextField (để áp dụng style Pastel)
  const dateTimePickerTextFieldSx = {
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
    // Đảm bảoDateTimePicker trông giống TextField bình thường
    "& .MuiInputBase-input": {
      padding: "12px 14px",
      fontSize: "15px",
    },
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
                <option key={asset.assetID} value={asset.assetID}>
                  {index + 1}. {asset.name} — #{asset.code}
                </option>
              ))}
            </select>
          </div>

          {/* DUE DATE - MUI */}
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <DateTimePicker
              value={form.dueDate}
              onChange={(value) => handleChange("dueDate", value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  sx: dateTimePickerTextFieldSx, // Áp dụng style Pastel
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

          {/* SUBMIT */}
          <button style={styles.btn} onClick={handleSubmit}>
            <FaPlus />
            Create Work
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
