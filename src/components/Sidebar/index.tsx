"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as FaTachometerAlt,
  Inventory as FaCube,
  Warehouse as FaWarehouse,
  AccountCircle as FaUserCircle,
  Build as FaTools,
  Email as FaEnvelopeOpenText,
  Notifications as FaBell,
  AssignmentReturn as FaBriefcase,
} from "@mui/icons-material";
import axios from "axios";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = ({ collapse = false }) => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");

  // States cho các dropdown (dành cho Managers)
  const [openRequest, setOpenRequest] = useState(true);
  const [openAssets, setOpenAssets] = useState(true);
  const [openWork, setOpenWork] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage
      .getItem("username")
      ?.toLowerCase()
      .trim();
    if (storedUsername === "admin") {
      setIsAdmin(true);
    }
    fetchRole(storedUsername);
  }, []);

  const fetchRole = async (username?: string) => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userStr && token) {
        const parsedUser = JSON.parse(userStr);
        const res: any = await axios.get(
          `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/Account/${parsedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        if (res?.data?.data) {
          const roleFromApi = res.data.data.role;
          setUserRole(roleFromApi);

          if (username === "admin" || roleFromApi.toLowerCase() === "admin") {
            setIsAdmin(true);
          }
        }
      }
    } catch (err) {
      console.error("Fetch role failed", err);
    }
  };

  // ==========================
  // PHÂN LOẠI ROLE ĐÃ ĐƯỢC CHUẨN HÓA
  // ==========================
  const normalizedRole = userRole?.toLowerCase().replace(/\s+/g, "") || "";

  const isGM = normalizedRole === "generalmanager";
  const isWM = normalizedRole === "warehousemanager";
  const isAM = normalizedRole === "assetsmanager";

  const isManager = isGM || isWM || isAM;
  const isStaffOrTech = ["staff", "technicalstaff"].includes(normalizedRole);

  // Toggle handlers
  const handleToggleRequest = () => setOpenRequest(!openRequest);
  const handleToggleAssets = () => setOpenAssets(!openAssets);
  const handleToggleWork = () => setOpenWork(!openWork);

  const getActiveStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      backgroundColor: isActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
      color: isActive ? "#3b82f6" : "#adb5bd",
      borderRadius: "8px",
      mb: "4px",
      transition: "all 0.2s ease",
      "& .MuiListItemIcon-root": {
        color: isActive ? "#3b82f6" : "inherit",
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        color: "#fff",
        "& .MuiListItemIcon-root": { color: "#fff" },
      },
    };
  };

  return (
    <Box
      className="app-sidebar"
      sx={{
        width: collapse ? 0 : 250,
        bgcolor: "#0e1a2b",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        p: collapse ? 0 : "20px 12px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: 800,
          textAlign: "center",
          mb: 4,
          letterSpacing: 2,
        }}
      >
        AMS
      </Typography>

      <List component="nav" sx={{ p: 0 }}>
        {isAdmin ? (
          // ==========================
          // MENU CHO ADMIN
          // ==========================
          <ListItemButton
            component={Link}
            href="/Accounts"
            sx={getActiveStyle("/Accounts")}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FaUserCircle />
            </ListItemIcon>
            <ListItemText primary="User Accounts" />
          </ListItemButton>
        ) : (
          <>
            {/* ==========================
                MENU CHO MANAGER (GM, WM, AM)
                ========================== */}
            {isManager && (
              <>
                <ListItemButton
                  component={Link}
                  href="/home"
                  sx={getActiveStyle("/home")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaTachometerAlt />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>

                {/* Dropdown Assets (All Manager) */}
                <ListItemButton
                  onClick={handleToggleAssets}
                  sx={{ color: "#adb5bd", borderRadius: "8px" }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <FaCube />
                  </ListItemIcon>
                  <ListItemText primary="Assets" />
                  {openAssets ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAssets} timeout="auto">
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    <ListItemButton
                      component={Link}
                      href="/Assets"
                      sx={getActiveStyle("/Assets")}
                    >
                      <ListItemText
                        primary="All Assets"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      href="/PersonalAssets"
                      sx={getActiveStyle("/PersonalAssets")}
                    >
                      <ListItemText
                        primary="My Assets"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>

                {/* Warehouse (Chỉ GM và WM thấy, AM KHÔNG thấy) */}
                {(isGM || isWM) && (
                  <ListItemButton
                    component={Link}
                    href="/Warehouse"
                    sx={getActiveStyle("/Warehouse")}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FaWarehouse />
                    </ListItemIcon>
                    <ListItemText primary="Warehouse" />
                  </ListItemButton>
                )}

                {/* Dropdown Work Management (All Manager) */}
                <ListItemButton
                  onClick={handleToggleWork}
                  sx={{ color: "#adb5bd", borderRadius: "8px" }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <FaTools />
                  </ListItemIcon>
                  <ListItemText primary="Work" />
                  {openWork ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openWork} timeout="auto">
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    <ListItemButton
                      component={Link}
                      href="/Works"
                      sx={getActiveStyle("/Works")}
                    >
                      <ListItemText
                        primary="All Works"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      href="/AssignedWorks"
                      sx={getActiveStyle("/AssignedWorks")}
                    >
                      <ListItemText
                        primary="Assigned Work"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>

                {/* Dropdown Requests (All Manager) */}
                <ListItemButton
                  onClick={handleToggleRequest}
                  sx={{ color: "#adb5bd", borderRadius: "8px" }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <FaEnvelopeOpenText />
                  </ListItemIcon>
                  <ListItemText primary="Requests" />
                  {openRequest ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openRequest} timeout="auto">
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    <ListItemButton
                      component={Link}
                      href="/PersonalRequests"
                      sx={getActiveStyle("/PersonalRequests")}
                    >
                      <ListItemText
                        primary="My Requests"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      href="/StaffRequests"
                      sx={getActiveStyle("/StaffRequests")}
                    >
                      <ListItemText
                        primary="Staff Requests"
                        primaryTypographyProps={{ fontSize: "14px", ml: 3 }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>

                {/* Notifications (All Manager) */}
                <ListItemButton
                  component={Link}
                  href="/Notifications"
                  sx={getActiveStyle("/Notifications")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaBell />
                  </ListItemIcon>
                  <ListItemText primary="Notification" />
                </ListItemButton>
              </>
            )}

            {/* ==========================
                MENU CHO STAFF / TECH STAFF
                ========================== */}
            {!isManager && isStaffOrTech && (
              <>
                <ListItemButton
                  component={Link}
                  href="/PersonalAssets"
                  sx={getActiveStyle("/PersonalAssets")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaBriefcase />
                  </ListItemIcon>
                  <ListItemText primary="My Assets" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  href="/AssignedWorks"
                  sx={getActiveStyle("/AssignedWorks")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaTools />
                  </ListItemIcon>
                  <ListItemText primary="Assigned Work" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  href="/PersonalRequests"
                  sx={getActiveStyle("/PersonalRequests")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaEnvelopeOpenText />
                  </ListItemIcon>
                  <ListItemText primary="My Requests" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  href="/Notifications"
                  sx={getActiveStyle("/Notifications")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FaBell />
                  </ListItemIcon>
                  <ListItemText primary="Notification" />
                </ListItemButton>
              </>
            )}
          </>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
