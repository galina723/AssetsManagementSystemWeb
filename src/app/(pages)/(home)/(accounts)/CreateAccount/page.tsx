"use client";

import {
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";

const CreateAccountPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [roleID, setRoleID] = useState<number | null>(null);
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // 🔥 Loại bỏ Note khỏi state và form
  // const [note, setNote] = useState("");
  const [gender, setGender] = useState("Male");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const roleList = [
    { name: "General Manager", value: 2 },
    { name: "Assets Manager", value: 3 },
    { name: "Warehouse Manager", value: 4 },
    { name: "Staff", value: 5 },
    { name: "Technical Staff", value: 6 },
    { name: "Warehouse Staff", value: 7 },
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        roleID,
        email,
        fullName,
        password,
        department,
        dateOfBirth: birthday ? birthday.toISOString() : null,
        phoneNumber: phone,
        gender,
        username,
        // 🔥 Loại bỏ Note khỏi payload
        // note: note,
      };

      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Create account success!");
      router.push("Accounts");
    } catch (err) {
      console.log(err);
      alert("Create failed!");
    }
  };

  // Màu chính Pastel
  const mainPastelColor = "#a0c4ff"; // Xanh pastel
  const mainPastelHoverColor = "#b8cffc";
  const mainPastelTextColor = "#3d5a80"; // Màu chữ tối nhẹ

  // Style cho TextField (Pastel)
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

  return (
    <>
      <Box
        className="page"
        sx={{
          background: "#fcfcfc",
          padding: { xs: 2, sm: 3, md: 4 },
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
              Create New Account
            </Typography>
          </Box>
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
            Save Account
          </Button>
        </Box>

        {/* FORM CARD */}
        <Box
          className="card"
          sx={{
            background: "white",
            boxShadow: "0 4px 16px rgba(160, 196, 255, 0.1)",
            border: "1px solid #e0e7f2",
            borderRadius: "16px",
            padding: { xs: 3, md: 5 },
          }}
        >
          {/* 🔥 Bố cục Grid 2 cột cho 9 trường */}
          <div className="grid">
            {/* Cột 1 */}
            {/* FULL NAME */}
            <div className="field">
              <label>Full Name</label>
              <TextField
                fullWidth
                size="small"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* USERNAME */}
            <div className="field">
              <label>Username</label>
              <TextField
                fullWidth
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* EMAIL */}
            <div className="field">
              <label>Email</label>
              <TextField
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label>Password</label>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* Cột 2 */}
            {/* ROLE */}
            <div className="field">
              <label>Role</label>
              <TextField
                fullWidth
                select
                size="small"
                value={roleID ?? ""}
                onChange={(e) => setRoleID(Number(e.target.value))}
                sx={pastelTextFieldSx}
              >
                {roleList.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* DEPARTMENT — TEXT INPUT */}
            <div className="field">
              <label>Department</label>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* PHONE — TEXT INPUT */}
            <div className="field">
              <label>Phone Number</label>
              <TextField
                fullWidth
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={pastelTextFieldSx}
              />
            </div>

            {/* BIRTHDAY */}
            <div className="field">
              <label>Birthday</label>
              <div className="datepicker">
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={birthday}
                    onChange={(v) => setBirthday(v)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: pastelTextFieldSx,
                      },
                    }}
                  />
                </DemoContainer>
              </div>
            </div>

            {/* GENDER */}
            <div className="field">
              <label>Gender</label>
              <TextField
                fullWidth
                select
                size="small"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={pastelTextFieldSx}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </div>

            {/* 🔥 NOTE field removed */}
          </div>
        </Box>
      </Box>

      {/* ================== STYLE (Đã cập nhật Padding) ================== */}
      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 100vh;
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
          border-radius: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px; /* Khoảng cách giữa các hàng và cột */
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

        .datepicker {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default CreateAccountPage;
