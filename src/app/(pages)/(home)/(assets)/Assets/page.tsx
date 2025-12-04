"use client";

import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import { AssetService } from "@/services/assetService";
import { AssetModel } from "@/models/asset/AssetModel";

interface Data {
  no: number;
  id: string;
  name: string;
  unit: string;
  status: string;
  note: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const AssetsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [listAssetData, setListAssetData] = useState<AssetModel[]>();

  useEffect(() => {
    getListAssetData();
  }, []);

  const getListAssetData = async () => {
    const asset = await AssetService.getAllAsset();

    console.log(asset);

    if (asset !== "fail") {
      setListAssetData(asset);
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "no",
      numeric: false,
      disablePadding: false,
      label: "No.",
    },
    {
      id: "id",
      numeric: false,
      disablePadding: false,
      label: "Asset id",
    },
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "unit",
      numeric: false,
      disablePadding: false,
      label: "Unit",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "note",
      numeric: false,
      disablePadding: false,
      label: "Note",
    },
  ];

  useEffect(() => {
    dispatch(addSidebar("asset"));
  }, [dispatch]);

  return (
    <div className="assets-page" style={{ height: "calc(100vh - 120px)" }}>
      <div className="assets-page__header">
        <div className="assets-page__header__title">Assets</div>
        <div className="assets-page__header__group">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => router.push("CreateAssets")}
          >
            Add asset
          </Button>
        </div>
      </div>

      <div id="table-data" className="assets-page__container">
        <TableContainer
          sx={{
            maxHeight:
              "calc(100vh - (64px + 24px + 37px + 24px + 24px + 52px))",
          }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={"center"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell align={"center"} padding={"none"}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listAssetData &&
                listAssetData.map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.assetID}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        onClick={() => router.push("/DetailAsset")}
                        component="th"
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell
                        onClick={() => router.push("/DetailAsset")}
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {row.assetID}
                      </TableCell>
                      <TableCell
                        align="left"
                        onClick={() => router.push("/DetailAsset")}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        onClick={() => router.push("/DetailAsset")}
                        align="center"
                      >
                        {row.unit}
                      </TableCell>
                      <TableCell
                        onClick={() => router.push("/DetailAsset")}
                        align="center"
                      >
                        {row.status}
                      </TableCell>
                      <TableCell
                        onClick={() => router.push("/DetailAsset")}
                        align="center"
                      >
                        {row.note}
                      </TableCell>
                      <TableCell align="center">
                        <div>
                          <IconButton
                            color="success"
                            onClick={() => router.push("EditAssets")}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AssetsPage;
