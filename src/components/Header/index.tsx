"use client";

import React, { FC, useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import { addAuth } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import axios from "axios";

interface Props {
  onClick: () => void;
  collapse?: boolean;
}

const Header: FC<Props> = (props) => {
  const { onClick, collapse = false } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✨ Tự động lấy dữ liệu khi trang vừa load
  useEffect(() => {
    fetchProfileData(true); // true nghĩa là chạy ngầm, không mở modal
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const fetchProfileData = async (isSilent = false) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    // Lấy ID từ Object user lưu trong localStorage {"id": 1, "fullName": "..."}
    const userData = JSON.parse(userStr);
    const userId = userData.id || userData.userID;
    const token = localStorage.getItem("token");

    try {
      if (!isSilent) setLoading(true);
      const res = await axios.get(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      setProfileData(res.data.data);
      if (!isSilent) setOpenModal(true);
    } catch (err) {
      console.error("Fetch profile failed", err);
    } finally {
      setLoading(false);
      handleCloseMenu();
    }
  };

  const handleLogout = () => {
    // localStorage.clear();
    // dispatch(addAuth(false));
    // window.location.href = "/login";
    localStorage.setItem("auth", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(addAuth(false));
    window.location.reload();
    setAnchorEl(null);
  };

  // Hàm lấy tên hiển thị
  const getDisplayName = () => {
    if (profileData?.fullName) return profileData.fullName;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.fullName || user.username;
    }

    return localStorage.getItem("username") || "My Account";
  };

  return (
    <div className="app-header">
      <Box
        sx={{
          width: collapse ? "100vw" : "calc(100vw - 250px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          height: "64px",
          bgcolor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          transition: "width 0.3s ease",
        }}
      >
        <IconButton onClick={onClick}>
          <MenuIcon />
        </IconButton>

        <Button
          startIcon={<AccountCircleIcon />}
          onClick={handleOpenMenu}
          sx={{ textTransform: "none", fontWeight: 700, color: "#4b5563" }}
        >
          {/* Hiển thị tên thông minh: Ưu tiên API -> LocalStorage -> Default */}
          {getDisplayName()}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          disableScrollLock
        >
          <MenuItem
            onClick={() => fetchProfileData(false)}
            sx={{ minWidth: 150 }}
          >
            My Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "#f43f5e" }}>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* MODAL PROFILE */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: { borderRadius: "24px", width: "100%", maxWidth: "400px" },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {profileData && (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profileData.avatar}
                sx={{
                  width: 90,
                  height: 90,
                  mb: 2,
                  bgcolor: "#C7CEEA",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                }}
              >
                {profileData.fullName?.charAt(0)}
              </Avatar>

              <Typography variant="h6" fontWeight={800} color="#1f2937">
                {profileData.fullName}
              </Typography>

              <Chip
                label={profileData.role}
                size="small"
                sx={{
                  bgcolor: "#E2F0CB",
                  color: "#4D7C0F",
                  fontWeight: 700,
                  mb: 4,
                  mt: 1,
                }}
              />

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <InfoItem
                  icon={<BadgeIcon />}
                  label="Username"
                  value={profileData.username}
                />
                <InfoItem
                  icon={<EmailIcon />}
                  label="Email Address"
                  value={profileData.email}
                />
                <InfoItem
                  icon={<BusinessIcon />}
                  label="Department"
                  value={profileData.department || "N/A"}
                />
                <InfoItem
                  icon={<PhoneIcon />}
                  label="Phone Number"
                  value={profileData.phone || "N/A"}
                />
                <InfoItem
                  icon={<WcIcon />}
                  label="Gender"
                  value={profileData.gender}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            onClick={() => setOpenModal(false)}
            sx={{
              bgcolor: "#f3f4f6",
              color: "#4b5563",
              borderRadius: "12px",
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#e5e7eb" },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "10px",
        bgcolor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af",
        mr: 2,
      }}
    >
      {React.cloneElement(icon, { fontSize: "small" })}
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default Header;
