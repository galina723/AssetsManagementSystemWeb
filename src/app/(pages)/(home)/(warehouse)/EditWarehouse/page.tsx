"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

// Style cho label
const pastelLabelStyle: any = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#5c677d",
  marginBottom: "4px",
  display: "block",
};

const EditWarehouse = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id"); // /warehouse/edit?id=5

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    createdDate: "",
    latitude: 0,
    longitude: 0,
    managerUserIds: [] as number[],
  });

  const [staffList, setStaffList] = useState<AccountModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // =========================
  // FETCH STAFF (Warehouse Staff/Manager)
  // =========================
  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = res.data?.data || [];
      const staff = data.filter(
        (u: any) => u.role.includes("Staff") || u.role.includes("Manager")
      );

      setStaffList(staff);
    } catch (e) {
      console.log("Get staff error:", e);
    }
  };

  // =========================
  // LOAD WAREHOUSE BY ID
  // =========================
  const fetchWarehouse = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = res.data?.data;

      setForm({
        name: data.name,
        description: data.description,
        address: data.address,
        createdDate: data.createdDate,
        latitude: data.latitude,
        longitude: data.longitude,
        managerUserIds: data.managerUserIds || [],
      });
    } catch (e) {
      console.log("Get warehouse error:", e);
      alert("Error loading warehouse data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWarehouse();
      fetchStaff();
    }
  }, [id]);

  // =========================
  // UPDATE WAREHOUSE
  // =========================
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      await axios.put(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Warehouse updated!");
      router.push("/Warehouse");
    } catch (e) {
      console.log(e);
      alert("Error updating warehouse!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
          Loading data...
        </Typography>
      </Box>
    );
  }

  // =========================
  // UI
  // =========================
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
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => router.push("/Warehouse")}
            sx={{ color: mainPastelTextColor }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: mainPastelTextColor,
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Edit Warehouse
          </Typography>
        </Box>

        {/* SUBMIT BUTTON - STYLE PASTEL NỔI BẬT */}
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
          {submitting ? "Updating..." : "Update Warehouse"}
        </Button>
      </Box>

      {/* FORM CARD */}
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
          {/* CỘT TRÁI - DÀI HƠN: NAME, ADDRESS, LAT, LNG */}
          <Box
            className="col"
            sx={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* NAME */}
            <Box className="field">
              <label style={pastelLabelStyle}>Name</label>
              <TextField
                fullWidth
                size="small"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                sx={pastelTextFieldSx}
              />
            </Box>

            {/* ADDRESS */}
            <Box className="field">
              <label style={pastelLabelStyle}>Address</label>
              <TextField
                fullWidth
                size="small"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                sx={pastelTextFieldSx}
              />
            </Box>

            {/* LATITUDE */}
            <Box className="field">
              <label style={pastelLabelStyle}>Latitude</label>
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
              <label style={pastelLabelStyle}>Longitude</label>
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

            {/* CREATED DATE (READ ONLY) */}
            <Box className="field">
              <label style={pastelLabelStyle}>Created Date</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={
                  form.createdDate
                    ? new Date(form.createdDate).toLocaleDateString()
                    : "N/A"
                }
                sx={{
                  ...pastelTextFieldSx,
                  "& .MuiOutlinedInput-root.Mui-disabled": {
                    backgroundColor: "#eef2ff",
                  },
                }} // Nền disabled
              />
            </Box>
          </Box>

          {/* CỘT PHẢI - DÀI HƠN: DESCRIPTION (ĐA DÒNG) VÀ MANAGER USERS (SELECT MULTI) */}
          <Box
            className="col"
            sx={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* DESCRIPTION (Multiline) */}
            <Box className="field">
              <label style={pastelLabelStyle}>Description</label>
              <TextField
                fullWidth
                multiline
                rows={7} // 🔥 Tăng rows để cân bằng với các trường ở cột 1
                size="small"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                sx={pastelTextFieldSx}
              />
            </Box>

            {/* MANAGER USERS */}
            <Box className="field">
              <label style={pastelLabelStyle}>Manager User (Staff)</label>
              {loading ? ( // Sử dụng loading state chung
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
                  {staffList.map((u) => (
                    <MenuItem key={u.userID} value={u.userID}>
                      {u.fullName} ({u.role})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          </Box>
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

export default EditWarehouse;
