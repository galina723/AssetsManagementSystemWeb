"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

// --- PROFESSIONAL PASTEL PALETTE ---
const THEME = {
  primary: "#6366F1", // Indigo hiện đại
  primaryLight: "#EEF2FF",
  bg: "#F8FAFC", // Nền nền xám xanh nhạt dịu mắt
  cardBg: "#FFFFFF",
  border: "#E2E8F0",
  textMain: "#0F172A", // Slate 900
  textMuted: "#64748B", // Slate 500
  accent: "#C7D2FE", // Pastel Purple-Blue
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const redirectByRoleId = (roleId: number) => {
    const routes: Record<number, string> = {
      1: "/Accounts",
      2: "/home",
      3: "/home",
      4: "/home",
    };
    window.location.href = routes[roleId] || "/PersonalRequests";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedRoleId = Number(localStorage.getItem("roleId"));
      redirectByRoleId(storedRoleId);
    } else {
      setTimeout(() => setLoading(false), 500); // Tạo cảm giác mượt mà
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
        return;
      }

      const result = response.data;
      if (result.success && result.token) {
        dispatch(addAuth(true));
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", username.toLowerCase().trim());
        localStorage.setItem("roleId", result.user?.roleId.toString());
        localStorage.setItem("user", JSON.stringify(result.user));
        redirectByRoleId(Number(result.user?.roleId));
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
      <Box sx={loadingOverlayStyles}>
        <CircularProgress
          size={40}
          thickness={4}
          sx={{ color: THEME.primary }}
        />
      </Box>
    );

  return (
    <>
      {/* Khai báo Keyframes cho hiệu ứng xoay Gradient */}
      <style jsx global>{`
        @keyframes rotateGradient {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <Box sx={rootStyles}>
        <Container
          maxWidth="sm"
          sx={{ zIndex: 1, display: "flex", justifyContent: "center" }}
        >
          {/* Vùng chứa bọc ngoài tạo hiệu ứng Animated Gradient Border */}
          <Box sx={animatedBorderWrapperStyles}>
            <Paper elevation={0} sx={cardStyles}>
              <form onSubmit={handleLogin}>
                <Box textAlign="center" mb={5}>
                  <Box sx={logoContainerStyles}>
                    <ShieldOutlined sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" sx={titleStyles}>
                    AMS
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: THEME.textMuted, letterSpacing: "0.5px" }}
                  >
                    ASSET MANAGEMENT SYSTEM
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography sx={labelStyles}>Username</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined
                              sx={{ color: THEME.textMuted, fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography sx={labelStyles}>Password</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: THEME.primary,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Forgot?
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined
                              sx={{ color: THEME.textMuted, fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: THEME.textMuted }}
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
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    disabled={loginLoading}
                    variant="contained"
                    disableElevation
                    sx={submitBtnStyles}
                  >
                    {loginLoading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <Typography variant="caption" sx={footerNoteStyles}>
                    Secure environment. Authorized access only.
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

// --- STYLES (ĐÃ CẢI TIẾN) ---

const rootStyles = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  backgroundColor: THEME.bg,
  backgroundImage: `radial-gradient(circle at top right, #EEF2FF 0%, transparent 40%),
                    radial-gradient(circle at bottom left, #FDF4FF 0%, transparent 40%)`, // Gradient nền tinh tế
};

// --- HIỆU ỨNG ANIMATED PASTEL BORDER ---
const animatedBorderWrapperStyles = {
  position: "relative",
  width: "100%",
  maxWidth: 440,
  borderRadius: "32px",
  padding: "4px", // Độ dày của cái viền mờ ảo
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.15)", // Đổ bóng dịu
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    // Dải gradient pastel lặp lại nhiều màu: Tím nhạt -> Hồng phấn -> Xanh Mint -> Tím nhạt
    background:
      "conic-gradient(from 0deg, transparent 0%, #C7D2FE 20%, #FBCFE8 40%, #A7F3D0 60%, transparent 80%)",
    animation: "rotateGradient 6s linear infinite",
    zIndex: 0,
  },
};

const cardStyles = {
  position: "relative", // Phải có relative để nổi lên trên ::before
  zIndex: 1, // Nổi lên trên nền xoay
  width: "100%",
  p: { xs: 4, md: 6 },
  borderRadius: "28px", // Bo nhỏ hơn viền ngoài một chút để khít
  backgroundColor: THEME.cardBg,
};

const logoContainerStyles = {
  width: 64,
  height: 64,
  borderRadius: "20px",
  backgroundColor: "#fff",
  color: THEME.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
  boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.2)",
  border: `1px solid ${THEME.primaryLight}`,
};

const titleStyles = {
  fontWeight: 800,
  color: THEME.textMain,
  letterSpacing: "-1px",
  mb: 0.5,
};

const labelStyles = {
  fontSize: "0.8rem",
  fontWeight: 700,
  color: THEME.textMain,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  mb: 1,
  ml: 0.5,
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "& fieldset": { borderColor: THEME.border, borderWidth: "1px" },
    "&:hover": {
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#CBD5E1" },
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: `0 0 0 4px ${THEME.primaryLight}`,
      "& fieldset": { borderColor: THEME.primary, borderWidth: "1.5px" },
    },
  },
};

const submitBtnStyles = {
  py: 1.8,
  borderRadius: "16px",
  backgroundColor: THEME.primary,
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 10px 20px -6px rgba(99, 102, 241, 0.4)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#4F46E5",
    transform: "translateY(-2px)",
    boxShadow: "0 14px 24px -6px rgba(99, 102, 241, 0.5)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
};

const footerNoteStyles = {
  display: "block",
  textAlign: "center",
  color: THEME.textMuted,
  mt: 2,
  fontSize: "0.75rem",
  opacity: 0.8,
};

const loadingOverlayStyles = {
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: THEME.bg,
};

export default LoginPage;
