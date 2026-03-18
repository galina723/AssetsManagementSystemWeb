"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import { Visibility, VisibilityOff, Lock, Person } from "@mui/icons-material";

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Nhóm quyền điều hướng
  const managerRoles = ["GeneralManager", "AssetManager", "WarehouseManager"];
  const staffRoles = ["Staff", "TechnicalStaff"];

  // --- HÀM ĐIỀU HƯỚNG ---
  const redirectByUserRole = (role: string, name: string) => {
    const normalizedName = name.toLowerCase().trim();

    if (normalizedName === "admin" || role === "Admin") {
      window.location.href = "/Accounts";
    }
    // 3 Manager (General, Asset, Warehouse) vào Dashboard
    else if (managerRoles.includes(role)) {
      window.location.href = "/home";
    }
    // Staff và Kỹ thuật vào Works
    else if (staffRoles.includes(role)) {
      window.location.href = "/Works";
    } else {
      // Dự phòng cho các role khác
      window.location.href = "/PersonalRequests";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("username") || "";
      const storedRole = localStorage.getItem("role") || "";
      redirectByUserRole(storedRole, storedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || loginLoading) return;

    setLoginLoading(true);
    try {
      const response = await AuthService.login({ username, password });

      if (response === "fail") {
        alert("Login failed. Please check your credentials.");
        setLoginLoading(false);
        return;
      }

      const result = response.data;
      if (result.success && result.token) {
        dispatch(addAuth(true));

        const normalizedUsername = username.toLowerCase().trim();
        const userRole = result.user?.role || "";

        // Lưu thông tin vào Storage
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", normalizedUsername);
        localStorage.setItem("role", userRole);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Thực hiện điều hướng ngay lập tức
        redirectByUserRole(userRole, normalizedUsername);
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (err) {
      alert("System error. Please try again later.");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        bgcolor="#F8FAFF"
      >
        <CircularProgress size={40} sx={{ color: mainPastelColor }} />
      </Box>
    );

  return (
    <div className="ams-login-root">
      <div className="bg-animation">
        <div className="sphere color-1"></div>
        <div className="sphere color-2"></div>
      </div>

      <div className="login-wrapper">
        <div className="bling-border-box">
          <form className="login-glass-card" onSubmit={handleLogin}>
            <div className="login-header">
              <div className="logo-box">A</div>
              <h1>AMS System</h1>
              <p>Sign in to continue managing assets</p>
            </div>

            <div className="form-content">
              <div className="input-field">
                <label>Username</label>
                <TextField
                  fullWidth
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={inputStyles}
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: mainPastelColor, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="input-field">
                <label>Password</label>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputStyles}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: mainPastelColor, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <Button
                fullWidth
                type="submit"
                disabled={loginLoading}
                className="submit-bling"
                disableElevation
              >
                {loginLoading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Sign In Now"
                )}
              </Button>

              <div className="forgot-pass">
                <a href="#">Forgot your password?</a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .ams-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f4f8;
          position: relative;
          overflow: hidden;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .bg-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          filter: blur(100px);
          z-index: 0;
        }
        .sphere {
          position: absolute;
          border-radius: 50%;
          animation: drift 15s infinite alternate ease-in-out;
        }
        .color-1 {
          width: 500px;
          height: 500px;
          background: #c2e9fb;
          top: -10%;
          left: -5%;
        }
        .color-2 {
          width: 600px;
          height: 600px;
          background: #fff1eb;
          bottom: -10%;
          right: -5%;
        }
        @keyframes drift {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(50px, 50px);
          }
        }
        .login-wrapper {
          z-index: 1;
          padding: 20px;
        }
        .bling-border-box {
          position: relative;
          padding: 3px;
          border-radius: 32px;
          background: linear-gradient(
            135deg,
            ${mainPastelColor},
            #ffadad,
            #caffbf,
            ${mainPastelColor}
          );
          background-size: 300% 300%;
          animation: gradientMove 6s infinite linear;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .login-glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 50px 40px;
          border-radius: 30px;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .logo-box {
          width: 45px;
          height: 45px;
          background: ${mainPastelColor};
          color: white;
          border-radius: 12px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 22px;
          box-shadow: 0 5px 15px rgba(160, 196, 255, 0.5);
        }
        .login-header h1 {
          font-size: 26px;
          color: ${mainPastelTextColor};
          margin: 0;
          font-weight: 800;
        }
        .input-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: ${mainPastelTextColor};
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        :global(.submit-bling) {
          height: 45px !important; /* Đã làm gọn chiều cao */
          color: white !important;
          border-radius: 12px !important;
          background: linear-gradient(
            90deg,
            ${mainPastelColor},
            #89b3ff
          ) !important;
          font-weight: 700 !important;
          font-size: 15px !important; /* Chữ nhỏ lại một chút cho cân đối */
          text-transform: none !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 6px 15px rgba(160, 196, 255, 0.3) !important;
          margin-top: 10px !important;
        }
        :global(.submit-bling:hover) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(160, 196, 255, 0.4) !important;
          filter: brightness(1.05);
        }

        .forgot-pass {
          text-align: center;
        }
        .forgot-pass a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#f1f5f9" },
    "&:hover fieldset": { borderColor: mainPastelColor },
    "&.Mui-focused fieldset": {
      borderColor: mainPastelColor,
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": { padding: "15px 14px" },
};

export default LoginPage;
