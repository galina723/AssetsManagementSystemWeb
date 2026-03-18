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
  AssignmentReturn as FaBriefcase, // Icon cho Personal Assets
} from "@mui/icons-material";
import axios from "axios";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = ({ collapse = false }) => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [openRequest, setOpenRequest] = useState(true);
  const [openAssets, setOpenAssets] = useState(true); // State cho dropdown Assets

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
          `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${parsedUser.id}`,
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

          if (username === "admin" || roleFromApi === "Admin") {
            setIsAdmin(true);
          }
        }
      }
    } catch (err) {
      console.error("Fetch role failed", err);
    }
  };

  const isManager = [
    "GeneralManager",
    "AssetManager",
    "WarehouseManager",
  ].includes(userRole);

  // Kiểm tra role cho Staff/Technical (thường tương ứng ID 2, 3, 4)
  const isStaffOrTech =
    ["Staff", "TechnicalStaff", "Employee"].includes(userRole) || isManager;

  const handleToggleRequest = () => setOpenRequest(!openRequest);
  const handleToggleAssets = () => setOpenAssets(!openAssets);

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

                {/* Dropdown Assets cho Manager */}
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
              </>
            )}

            {/* HIỂN THỊ MY ASSET CHO STAFF (ROLE 2,3,4) NHƯNG KHÔNG PHẢI MANAGER */}
            {!isManager && isStaffOrTech && (
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
            )}

            <ListItemButton
              component={Link}
              href="/Works"
              sx={getActiveStyle("/Works")}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FaTools />
              </ListItemIcon>
              <ListItemText primary="Work" />
            </ListItemButton>

            {/* REQUESTS LOGIC */}
            {isManager ? (
              <>
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
              </>
            ) : (
              <ListItemButton
                component={Link}
                href="/PersonalRequests"
                sx={getActiveStyle("/PersonalRequests")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <FaEnvelopeOpenText />
                </ListItemIcon>
                <ListItemText primary="Requests" />
              </ListItemButton>
            )}

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
      </List>
    </Box>
  );
};

export default Sidebar;
