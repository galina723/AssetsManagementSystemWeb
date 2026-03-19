"use client";

import CountItem from "@/components/Home/CountItem";
import { AssetModel } from "@/models/asset/AssetModel";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// --- Hàm hỗ trợ định dạng ---
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// --- MAPPING THEO CHUẨN STAFF REQUEST PAGE ---
const REPORT_TYPES: { [key: number]: string } = {
  0: "Broken",
  1: "Recall",
  2: "Lost",
  3: "Report",
  4: "Location Change",
  5: "Wh. Delete",
};

const getRequestStatusUi = (status: number) => {
  const map: any = {
    0: { label: "Pending", bg: "#fef3c7", color: "#b45309" }, // Vàng/Cam
    1: { label: "Accepted", bg: "#dcfce7", color: "#15803d" }, // Xanh lá
    2: { label: "Rejected", bg: "#fee2e2", color: "#b91c1c" }, // Đỏ
  };
  return map[status] || { label: "Unknown", bg: "#f1f5f9", color: "#475569" }; // Xám
};

const HomePage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [summary, setSummary] = useState({
    totalAssets: 0,
    totalAccounts: 0,
    pendingWorks: 0,
    totalRequests: 0,
    assetStatusDist: [] as any[],
  });

  // ✨ Pastel Bling Palette
  const blingColors = [
    "#FFB7B2",
    "#FFDAC1",
    "#E2F0CB",
    "#B5EAD7",
    "#C7CEEA",
    "#F3D1F4",
  ];

  const getStatusChipColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("available") || s.includes("active"))
      return { backgroundColor: "#B5EAD7", color: "#2D5A27" };
    if (s.includes("in use") || s.includes("assigned"))
      return { backgroundColor: "#FFDAC1", color: "#855723" };
    if (s.includes("broken") || s.includes("maintenance"))
      return { backgroundColor: "#FFB7B2", color: "#7A2B2B" };
    return { backgroundColor: "#E8E8E8", color: "#555" };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      };

      const [assetRes, accountRes, workRes, requestRes] = await Promise.all([
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
          config,
        ),
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
          config,
        ),
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/get-work-createdList",
          config,
        ),
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/RequestReport/staff-requestList",
          config,
        ),
      ]);

      const assetList = assetRes.data.data || [];
      const accountList = accountRes.data.data || [];
      const workList = workRes.data.data || [];
      const requestList = requestRes.data.data || [];

      setAssets(assetList);
      setRequests(requestList);

      const statusCounts = assetList.reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      setSummary({
        totalAssets: assetList.length,
        totalAccounts: accountList.length,
        pendingWorks: workList.filter((w: any) => w.status !== "Completed")
          .length,
        totalRequests: requestList.length,

        assetStatusDist: Object.keys(statusCounts).map((key, idx) => ({
          id: idx,
          value: statusCounts[key],
          label: key,
          color: blingColors[idx % blingColors.length],
        })),
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(addSidebar("home"));
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress sx={{ color: "#C7CEEA" }} />
      </Box>
    );
  }

  return (
    <div
      className="home-page"
      style={{
        padding: "25px",
        backgroundColor: "#FDFCFE",
        minHeight: "100vh",
      }}
    >
      {/* 💎 SECTION 1: TOP STATS COUNTERS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "35px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            filter: "drop-shadow(0px 8px 15px rgba(199, 206, 234, 0.4))",
          }}
        >
          <CountItem
            title="✨ Total Assets"
            count={summary.totalAssets}
            color="#C7CEEA"
          />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            filter: "drop-shadow(0px 8px 15px rgba(181, 234, 215, 0.4))",
          }}
        >
          <CountItem
            title="📩 Staff Requests"
            count={summary.totalRequests}
            color="#B5EAD7"
          />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            filter: "drop-shadow(0px 8px 15px rgba(255, 218, 193, 0.4))",
          }}
        >
          <CountItem
            title="👤 Staff Users"
            count={summary.totalAccounts}
            color="#FFDAC1"
          />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            filter: "drop-shadow(0px 8px 15px rgba(255, 183, 178, 0.4))",
          }}
        >
          <CountItem
            title="📝 Pending Tasks"
            count={summary.pendingWorks}
            color="#FFB7B2"
          />
        </div>
      </div>

      {/* 🍭 SECTION 2: CHARTS & REQUEST TABLE */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          marginBottom: "35px",
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        {/* PIE CHART CARD */}
        <Paper
          style={{
            flex: 1,
            minWidth: "350px",
            padding: "30px",
            borderRadius: "28px",
            boxShadow: "0 15px 35px rgba(200, 200, 255, 0.1)",
            border: "2px solid #FFFFFF",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F9F9FF 100%)",
          }}
        >
          <Typography
            variant="h6"
            style={{
              marginBottom: "25px",
              fontWeight: 800,
              color: "#6A7B9B",
              letterSpacing: "0.5px",
              textAlign: "center",
            }}
          >
            Asset Status Distribution
          </Typography>
          <div
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: summary.assetStatusDist,
                  innerRadius: 70,
                  outerRadius: 105,
                  paddingAngle: 8,
                  cornerRadius: 12,
                },
              ]}
              height={300}
            />
          </div>
        </Paper>

        {/* REQUESTS TABLE CARD */}
        <Paper
          style={{
            flex: 2,
            minWidth: "500px",
            padding: "30px",
            borderRadius: "28px",
            boxShadow: "0 15px 35px rgba(200, 200, 255, 0.1)",
            border: "2px solid #FFFFFF",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F9F9FF 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            style={{
              marginBottom: "15px",
              fontWeight: 800,
              color: "#6A7B9B",
              letterSpacing: "0.5px",
            }}
          >
            Recent Staff Requests
          </Typography>
          <TableContainer style={{ flexGrow: 1, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: 800,
                      color: "#A0AEC0",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #EDF2F7",
                      textAlign: "center",
                    }}
                  >
                    NO.
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: 800,
                      color: "#A0AEC0",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #EDF2F7",
                    }}
                  >
                    REQUESTER
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: 800,
                      color: "#A0AEC0",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #EDF2F7",
                    }}
                  >
                    TYPE
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: 800,
                      color: "#A0AEC0",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #EDF2F7",
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: 800,
                      color: "#A0AEC0",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #EDF2F7",
                    }}
                  >
                    STATUS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.slice(0, 5).map((req, index) => {
                  const statusUi = getRequestStatusUi(req.status);
                  return (
                    <TableRow
                      key={req.id}
                      hover
                      sx={{
                        "& td": { borderBottom: "1px dashed #EDF2F7" },
                        "&:hover": { backgroundColor: "#FDFCFE !important" },
                      }}
                    >
                      <TableCell
                        style={{
                          fontWeight: 700,
                          color: "#C7CEEA",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ fontWeight: 600, color: "#4A5568" }}>
                        {req.createdBy}
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            padding: "4px 8px",
                            background: "#e0e7ff",
                            color: "#4338ca",
                            borderRadius: "4px",
                            fontWeight: 600,
                            fontSize: "11px",
                          }}
                        >
                          {REPORT_TYPES[req.type] || req.type}
                        </span>
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#718096",
                          fontSize: "0.85rem",
                          fontStyle: "italic",
                        }}
                      >
                        {formatDate(req.createdDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusUi.label}
                          size="small"
                          sx={{
                            backgroundColor: statusUi.bg,
                            color: statusUi.color,
                            fontWeight: 800,
                            borderRadius: "16px",
                            fontSize: "11px",
                            minWidth: "75px",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      {/* 🎀 SECTION 3: INVENTORY INSIGHT */}
      <div className="home-page__section-3">
        <Typography
          variant="h6"
          style={{
            marginBottom: "15px",
            fontWeight: 800,
            color: "#6A7B9B",
            paddingLeft: "5px",
          }}
        >
          Inventory Insight
        </Typography>
        <TableContainer
          component={Paper}
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: "0 12px 45px rgba(0,0,0,0.04)",
            border: "none",
          }}
        >
          <Table>
            <TableHead style={{ backgroundColor: "#F9FAFF" }}>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: 800,
                    color: "#A0AEC0",
                    fontSize: "0.75rem",
                  }}
                >
                  NO.
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 800,
                    color: "#A0AEC0",
                    fontSize: "0.75rem",
                  }}
                >
                  ASSET NAME
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 800,
                    color: "#A0AEC0",
                    fontSize: "0.75rem",
                  }}
                >
                  TAG CODE
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 800,
                    color: "#A0AEC0",
                    fontSize: "0.75rem",
                  }}
                >
                  VALUATION
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 800,
                    color: "#A0AEC0",
                    fontSize: "0.75rem",
                  }}
                >
                  CONDITION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.slice(0, 10).map((item, index) => (
                <TableRow
                  key={item.assetID}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#FDFCFE !important" } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell style={{ fontWeight: 600, color: "#4A5568" }}>
                    {item.name}
                  </TableCell>
                  <TableCell style={{ color: "#718096", fontStyle: "italic" }}>
                    {item.code}
                  </TableCell>
                  <TableCell style={{ fontWeight: 700, color: "#6A7B9B" }}>
                    {item.price?.toLocaleString()} {item.currency}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        ...getStatusChipColor(item.status),
                        fontWeight: 800,
                        borderRadius: "10px",
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default HomePage;
