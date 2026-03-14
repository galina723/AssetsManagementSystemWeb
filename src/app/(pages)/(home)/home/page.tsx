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
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<AssetModel[]>([]);

  const [summary, setSummary] = useState({
    totalAssets: 0,
    totalWarehouses: 0,
    totalAccounts: 0,
    pendingWorks: 0,
    assetStatusDist: [] as any[],
    warehouseDist: [] as any[],
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

      const [assetRes, warehouseRes, accountRes, workRes] = await Promise.all([
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
          config,
        ),
        axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/warehouse",
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
      ]);

      const assetList = assetRes.data.data || [];
      const warehouseList = warehouseRes.data.data || [];
      const accountList = accountRes.data.data || [];
      const workList = workRes.data.data || [];

      setAssets(assetList);

      const statusCounts = assetList.reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      setSummary({
        totalAssets: assetList.length,
        totalWarehouses: warehouseList.length,
        totalAccounts: accountList.length,
        pendingWorks: workList.filter((w: any) => w.status !== "Completed")
          .length,

        assetStatusDist: Object.keys(statusCounts).map((key, idx) => ({
          id: idx,
          value: statusCounts[key],
          label: key,
          color: blingColors[idx % blingColors.length],
        })),

        warehouseDist: warehouseList.map((w: any) => ({
          label: w.name,
          value: assetList.filter((a: any) => a.warehouseID === w.warehouseID)
            .length,
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
            title="🏠 Warehouses"
            count={summary.totalWarehouses}
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

      {/* 🍭 SECTION 2: BLING CHARTS (SYMMETRIC FLEXBOX) */}
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
            minWidth: "450px",
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

        {/* BAR CHART CARD */}
        <Paper
          style={{
            flex: 1,
            minWidth: "450px",
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
            }}
          >
            Assets per Warehouse
          </Typography>
          <div style={{ height: "300px" }}>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  // ✨ Capped at 5 characters + ... for bling aesthetics
                  data: summary.warehouseDist.map((d) =>
                    d.label.length > 5
                      ? d.label.substring(0, 5) + "..."
                      : d.label,
                  ),
                  categoryGapRatio: 0.6,
                },
              ]}
              series={[
                {
                  data: summary.warehouseDist.map((d) => d.value),
                  color: "#C7CEEA", // Bling Lavender
                  label: "Assets",
                },
              ]}
              height={300}
              margin={{ top: 20, bottom: 40, left: 45, right: 10 }}
              borderRadius={12}
            />
          </div>
        </Paper>
      </div>

      {/* 🎀 SECTION 3: ELEGANT LIST TABLE */}
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
