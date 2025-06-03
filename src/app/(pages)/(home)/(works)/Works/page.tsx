"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

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

function createData(
  no: number,
  id: string,
  name: string,
  unit: string,
  status: string,
  note: string
): Data {
  return {
    no,
    id,
    name,
    unit,
    status,
    note,
  };
}

const rows = [
  createData(
    1,
    "Wk1",
    "Fix Macbook pro",
    "Nguyen Van A",
    "Processing",
    "20/10/2024"
  ),
  createData(
    2,
    "Wk2",
    "Maintenance Air cool",
    "Nguyen Tran Hoang A",
    "Done",
    "30/07/2025"
  ),
  createData(
    3,
    "Wk3",
    "Fixing laptop Dell",
    "Nguyen Thi C",
    "Processing",
    "25/05/2025"
  ),
];

const WorkPage = () => {
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
      label: "Work id",
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
      label: "Handler",
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
      label: "Created date",
    },
  ];

  const router = useRouter();

  return (
    <div className="assets-page" style={{ height: "calc(100vh - 120px)" }}>
      <div className="assets-page__header">
        <div className="assets-page__header__title">Works</div>
        {/* <div className="assets-page__header__group">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => router.push("CreateAssets")}
          >
            Add flow
          </Button>
        </div> */}
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
                {/* <TableCell align={"center"} padding={"none"}>
                  Action
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={() => router.push("/DetailWork")}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      align="center"
                      scope="row"
                      padding="none"
                    >
                      {row.no}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{row.unit}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.note}</TableCell>
                    {/* <TableCell align="center">
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
                    </TableCell> */}
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

export default WorkPage;
