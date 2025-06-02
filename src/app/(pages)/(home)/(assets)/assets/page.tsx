"use client";

import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Data {
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

function createData(
  id: string,
  name: string,
  unit: string,
  status: string,
  note: string
): Data {
  return {
    id,
    name,
    unit,
    status,
    note,
  };
}

const rows = [
  createData("Ad1", "Laptop Dell", "1", "Using", ""),
  createData("Ad2", "iMac M4", "8", "Using", ""),
  createData("Ad3", "Macbook Pro", "1", "Fixing", ""),
];

const AssetsPage = () => {
  const router = useRouter();

  const headCells: readonly HeadCell[] = [
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

  return (
    <div className="assets-page">
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
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      onClick={() => router.push("/DetailAsset")}
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {row.id}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={5}
          page={1}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
        />
      </div>
    </div>
  );
};

export default AssetsPage;
