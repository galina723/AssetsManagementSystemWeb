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
  createData("WH1", "PhuChanh 1", "1", "Using", ""),
  createData("WH2", "ABC", "8", "Using", ""),
  createData("WH3", "PPO Tan Phu", "1", "Fixing", ""),
];

const AssetsPage = () => {
  const router = useRouter();

  const headCells: readonly HeadCell[] = [
    {
      id: "id",
      numeric: false,
      disablePadding: false,
      label: "Warehouse id",
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
        <div className="assets-page__header__title">Warehouse</div>
        <div className="assets-page__header__group">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => router.push("CreateWarehouse")}
          >
            Add warehouse
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
                    onClick={(event) => console.log(event, row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" scope="row" padding="none">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{row.unit}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.note}</TableCell>
                    <TableCell align="center">
                      <div>
                        <IconButton
                          color="success"
                          onClick={() => router.push("EditWarehouse")}
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
