"use client";

import CountItem from "@/components/Home/CountItem";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function createAssetData(
  name: string,
  total: number,
  unit: string,
  status: string,
  note: string
) {
  return { name, total, unit, status, note };
}

const HomePage = () => {
  const dispatch = useDispatch();

  // ⭐ LẤY USER TỪ LOCAL STORAGE
  const [user, setUser] = useState<unknown>(null);

  const assetRows = [
    createAssetData("Paper", 15, "Piece", "Using", ""),
    createAssetData("Macbook Pro", 1, "Piece", "Fixing", ""),
    createAssetData("iMac M4", 15, "Piece", "Using", ""),
    createAssetData("Laptop Dell", 1, "Piece", "Using", ""),
    createAssetData("Projector", 1, "Piece", "Warehouse", ""),
  ];

  useEffect(() => {
    dispatch(addSidebar("home"));

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // ⭐ Lưu vào state
    }
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* {user && (
        <div style={{ marginBottom: 20, fontSize: 20, fontWeight: 600 }}>
          Welcome back, {user.name}
        </div>
      )} */}

      <div className="home-page__section-1">
        <CountItem title="Total Assets" count={75} color="red" />
        <CountItem title="In Warehouse" count={30} color="green" />
        <CountItem title="In Use" count={60} color="blue" />
        <CountItem title="Fixing" count={15} color="orange" />
      </div>

      <div className="home-page__section-2">
        <div className="home-page__section-2__selection-1">
          <div className="home-page__section-2__selection-1__title">
            Asset Chart
          </div>
          <BarChart
            xAxis={[{ data: ["Group A", "Group B", "Group C"] }]}
            series={[
              { data: [4, 3, 5], color: "rgba(173, 216, 230, 0.7)" },
              { data: [1, 6, 3], color: "rgba(144, 238, 144, 0.7)" },
              { data: [2, 5, 6], color: "rgba(255, 182, 193, 0.7)" },
            ]}
            height={300}
          />
        </div>

        <div className="home-page__section-2__selection-1 home-page__section-2__selection-2">
          <div className="home-page__section-2__selection-1__title">
            Warehouse Chart
          </div>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: 10,
                    label: "Series A",
                    color: "rgba(255, 160, 122, 0.7)",
                  },
                  {
                    id: 1,
                    value: 15,
                    label: "Series B",
                    color: "rgba(221, 160, 221, 0.7)",
                  },
                  {
                    id: 2,
                    value: 20,
                    label: "Series C",
                    color: "rgba(175, 238, 238, 0.7)",
                  },
                ],
              },
            ]}
            height={300}
          />
        </div>
      </div>

      <div className="home-page__section-3">
        <div className="home-page__section-2__selection-1__title">
          Asset Table
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="asset table">
            <TableHead>
              <TableRow>
                <TableCell>Asset Name</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assetRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                  <TableCell align="right">{row.unit}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.note}</TableCell>
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
