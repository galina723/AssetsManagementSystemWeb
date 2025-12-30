"use client";

import {
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs"; // Chỉ dùng dayjs cho định dạng

const EditAccountPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // lấy ?id=21

  const [fullName, setFullName] = useState("");
  const [roleID, setRoleID] = useState<number | null>(null);
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState(""); // Giữ là string để hiển thị ngày
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // MAP role string từ API -> roleID của bạn
  const roleMap: any = {
    "General Manager": 2,
    "Assets Manager": 3,
    "Warehouse Manager": 4,
    Staff: 5,
    "Technical Staff": 6,
    "Warehouse Staff": 7,
  };

  const roleList = [
    { name: "General Manager", value: 2 },
    { name: "Assets Manager", value: 3 },
    { name: "Warehouse Manager", value: 4 },
    { name: "Staff", value: 5 },
    { name: "Technical Staff", value: 6 },
    { name: "Warehouse Staff", value: 7 },
  ];

  // 🔥 Màu chính Pastel
  const mainPastelColor = "#a0c4ff"; // Xanh pastel
  const mainPastelHoverColor = "#b8cffc";
  const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

  // 🔥 Style cho TextField (Pastel) - Dùng cho cả disabled và select
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
      // Xử lý riêng cho trạng thái Disabled
      "&.Mui-disabled": {
        backgroundColor: "#eef2ff", // Nền nhạt hơn cho disabled
        color: "#777",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "#e0e7f2",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#5c677d",
    },
  };

  // ============================
  // FETCH ACCOUNT
  // ============================
  useEffect(() => {
    const fetchAccount = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const a = res.data.data;

        setFullName(a.fullName);
        setEmail(a.email);
        setUsername(a.username);
        setDepartment(a.department);
        setGender(a.gender);
        setPhone(a.phone);
        setNote(a.note || "");

        // Format Date
        const dob = a.dateOfBirth
          ? dayjs(a.dateOfBirth).format("YYYY-MM-DD")
          : "";
        setBirthday(dob);

        // map string role → roleID (5,6,7...)
        setRoleID(roleMap[a.role]);
      } catch (err) {
        console.log(err);
        alert("Cannot load account");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  // ============================
  // UPDATE ROLE
  // ============================
  const handleSave = async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");

      // Payload chỉ chứa roleID vì đây là trường duy nhất được phép chỉnh sửa
      const payload = { roleID };

      await axios.put(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Update success!");
      router.push("/Accounts");
    } catch (err) {
      console.log(err);
      alert("Update failed!");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fcfcfc",
        }}
      >
        <Typography variant="h6" color="#a0c4ff">
          Loading Account Data...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        className="page"
        sx={{
          background: "#fcfcfc",
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: "100vh",
        }}
      >
        {/* HEADER */}
        <Box className="header" sx={{ mb: 4 }}>
          <Box className="header-left">
            <IconButton
              onClick={() => router.push("/Accounts")}
              sx={{ color: mainPastelTextColor }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: mainPastelTextColor }}
            >
              Edit Account
            </Typography>
          </Box>

          {/* NÚT SAVE - STYLE PASTEL NỔI BẬT */}
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
            sx={{
              fontWeight: 700,
              borderRadius: "12px",
              paddingX: 3,
              paddingY: 1.2,
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
            Save
          </Button>
        </Box>

        {/* CARD */}
        <Box
          className="card"
          sx={{
            boxShadow: "0 4px 16px rgba(160, 196, 255, 0.1)",
            border: "1px solid #e0e7f2",
            padding: { xs: 3, md: 5 },
          }}
        >
          <div className="grid">
            {/* DISABLED FIELDS */}
            <div className="field">
              <label>Full Name</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={fullName}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Username</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={username}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={email}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Department</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={department}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Birthday</label>
              {/* Hiển thị ngày đã format */}
              <TextField
                fullWidth
                size="small"
                disabled
                value={birthday || "N/A"}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={phone}
                sx={pastelTextFieldSx}
              />
            </div>

            <div className="field">
              <label>Gender</label>
              <TextField
                fullWidth
                size="small"
                disabled
                value={gender}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* ONLY ROLE EDITABLE */}
            <div className="field">
              <label>Role</label>
              <TextField
                fullWidth
                select
                size="small"
                value={roleID ?? ""}
                onChange={(e) => setRoleID(Number(e.target.value))}
                sx={pastelTextFieldSx} // Áp dụng style pastel cho Select
              >
                {roleList.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="field full">
              <label>Note</label>
              <TextField
                fullWidth
                multiline
                minRows={3}
                disabled
                value={note}
                sx={pastelTextFieldSx}
              />
            </div>
          </div>
        </Box>
      </Box>

      {/* STYLE */}
      <style jsx>{`
        .page {
          /* padding, background -> Chuyển sang Box sx */
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card {
          background: white;
          /* padding -> Chuyển sang Box sx */
          border-radius: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field.full {
          grid-column: span 2;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: #5c677d;
        }
      `}</style>
    </>
  );
};

export default EditAccountPage;
