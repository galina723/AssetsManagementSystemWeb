"use client";

import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");

    // Nếu đã login rồi, kiểm tra username để điều hướng tiếp
    if (token) {
      if (storedUser === "admin") {
        window.location.href = "/Accounts";
      } else {
        window.location.href = "/home";
      }
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username || !password) return;

    setLoginLoading(true);
    try {
      const response = await AuthService.login({ username, password });

      if (response === "fail") {
        alert("Login failed. Please try again.");
        return;
      }

      const result = response.data;

      if (result.success && result.token) {
        dispatch(addAuth(true));

        // Chuẩn hóa username để check
        const normalizedUsername = username.toLowerCase().trim();

        // Lưu các thông tin cần thiết vào LocalStorage
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", normalizedUsername);

        if (result.user?.role) {
          localStorage.setItem("role", result.user.role);
        }

        // ✨ LOGIC ĐIỀU HƯỚNG TẠI ĐÂY
        if (normalizedUsername === "admin") {
          window.location.href = "/Accounts"; // Admin vào thẳng trang quản lý Account
        } else {
          window.location.href = "/home"; // User thường vào Dashboard
        }
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (err) {
      alert("System error: AMS services are currently unreachable.");
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
        bgcolor="#F9FAFB"
      >
        <CircularProgress size={24} sx={{ color: "#111827" }} />
      </Box>
    );

  return (
    <div className="ams-login">
      <div className="login-card">
        <div className="login-card__logo">
          <div className="logo-box">A</div>
          <span>AMS</span>
        </div>

        <div className="login-card__header">
          <h1>Sign in to AMS</h1>
          <p>Enterprise Asset Management System</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={inputStyles}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputStyles}
            />
          </div>

          <Button
            fullWidth
            type="submit"
            disabled={loginLoading}
            className="login-submit"
            disableElevation
          >
            {loginLoading ? "Authenticating..." : "Sign In"}
          </Button>

          <div className="login-card__footer-links">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>

      <style jsx>{`
        /* Giữ nguyên CSS cũ của bạn */
        .ams-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          font-family: "Inter", -apple-system, sans-serif;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          padding: 56px 48px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .login-card__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .logo-box {
          width: 36px;
          height: 36px;
          background: #111827;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-weight: 800;
        }
        .login-card__logo span {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }
        .login-card__header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-card__header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .login-card__header p {
          font-size: 14px;
          color: #6b7280;
        }
        .login-card__form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        :global(.login-submit) {
          height: 48px !important;
          background-color: #111827 !important;
          color: white !important;
          border-radius: 6px !important;
          text-transform: none !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          margin-top: 8px !important;
          transition: all 0.2s !important;
        }
        :global(.login-submit:hover) {
          background-color: #374151 !important;
        }
        .login-card__footer-links {
          text-align: center;
          margin-top: 8px;
          font-size: 13px;
          color: #6b7280;
        }
        .login-card__footer-links a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    backgroundColor: "#FFFFFF",
    fontSize: "15px",
    "& fieldset": { borderColor: "#D1D5DB" },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "2px" },
  },
  "& .MuiInputBase-input": { padding: "12px 16px" },
};

export default LoginPage;
