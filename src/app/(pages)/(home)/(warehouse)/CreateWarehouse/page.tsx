"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material"; // Thêm Button, Box, Typography
import SaveIcon from "@mui/icons-material/Save"; // Thêm icon Save
import { useRouter } from "next/navigation";

interface AccountModel {
  userID: number;
  fullName: string;
  role: string;
}

// 🔥 Màu chính Pastel
const mainPastelColor = "#a0c4ff"; // Xanh pastel
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

// 🔥 Style cho TextField (Pastel)
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

const AddWarehouse = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    createdDate: new Date().toISOString(),
    latitude: 0,
    longitude: 0,
    managerUserIds: [] as number[],
  });

  const [staffList, setStaffList] = useState<AccountModel[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // --- FETCH STAFF FROM API ACCOUNT ---
  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = res.data?.data || [];

      // Lọc ra các user có role là Staff hoặc WarehouseManager/WarehouseStaff nếu cần
      const staff = data.filter(
        (u: any) => u.role.includes("Staff") || u.role.includes("Manager"),
      );

      setStaffList(staff);
    } catch (err) {
      console.log("Error loading staff:", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // --- SUBMIT ---
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Đảm bảo latitude/longitude là số, và không gửi createdDate (server nên tự gen)
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };
      // Bỏ createdDate trong payload gửi đi
      delete (payload as any).createdDate;

      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      alert("Warehouse created!");
      router.push("/Warehouse");
    } catch (e) {
      console.log(e);
      alert("Error creating warehouse!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        background: "#fcfcfc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: mainPastelTextColor,
          textShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        Add New Warehouse
      </Typography>

      <Box
        sx={{
          background: "white",
          padding: { xs: 3, md: 5 },
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(160, 196, 255, 0.1)",
          border: "1px solid #e0e7f2",
          flexGrow: 1,
        }}
      >
        <Box
          className="grid"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 3, md: 5 },
          }}
        >
          {/* NAME */}
          <Box className="field">
            <label style={pastelFieldStyle.label}>Name</label>
            <TextField
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={pastelTextFieldSx}
            />
          </Box>

          {/* DESCRIPTION */}
          <Box className="field">
            <label style={pastelFieldStyle.label}>Description</label>
            <TextField
              fullWidth
              size="small"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              sx={pastelTextFieldSx}
            />
          </Box>

          {/* ADDRESS */}
          <Box className="field">
            <label style={pastelFieldStyle.label}>Address</label>
            <TextField
              fullWidth
              size="small"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              sx={pastelTextFieldSx}
            />
          </Box>

          {/* STAFF DROPDOWN MULTI */}
          {/* <Box className="field">
            <label style={pastelFieldStyle.label}>Manager Users (Staff)</label>
            {loadingStaff ? (
              <CircularProgress size={24} sx={{ color: mainPastelColor }} />
            ) : (
              <TextField
                fullWidth
                select
                size="small"
                SelectProps={{ multiple: true }}
                value={form.managerUserIds}
                onChange={(e) =>
                  setForm({
                    ...form,
                    managerUserIds: Array.isArray(e.target.value)
                      ? e.target.value.map(Number)
                      : [],
                  })
                }
                sx={pastelTextFieldSx}
              >
                {staffList.map((item) => (
                  <MenuItem key={item.userID} value={item.userID}>
                    {item.fullName} ({item.role})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box> */}

          {/* LATITUDE */}
          <Box className="field">
            <label style={pastelFieldStyle.label}>Latitude</label>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={form.latitude}
              onChange={(e) =>
                setForm({ ...form, latitude: Number(e.target.value) })
              }
              sx={pastelTextFieldSx}
            />
          </Box>

          {/* LONGITUDE */}
          <Box className="field">
            <label style={pastelFieldStyle.label}>Longitude</label>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={form.longitude}
              onChange={(e) =>
                setForm({ ...form, longitude: Number(e.target.value) })
              }
              sx={pastelTextFieldSx}
            />
          </Box>
        </Box>

        {/* SUBMIT BUTTON - STYLE PASTEL NỔI BẬT */}
        <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
          <Button
            startIcon={
              submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            variant="contained"
            disabled={submitting}
            onClick={handleSubmit}
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
            {submitting ? "Creating..." : "Create Warehouse"}
          </Button>
        </Box>
      </Box>

      {/* STYLE FOR LABELS AND FIELDS */}
      <style jsx global>{`
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Override MUI default label style for better integration with custom label */
        .MuiInputLabel-root {
          transform: translate(14px, 10px) scale(1);
          color: #5c677d !important;
        }

        .MuiInputLabel-shrink {
          transform: translate(14px, -9px) scale(0.75) !important;
        }
      `}</style>
    </Box>
  );
};

export default AddWarehouse;

// Style cho label (dùng cho các label custom)
const pastelFieldStyle: any = {
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#5c677d",
    marginBottom: "4px",
    display: "block",
  },
};
