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
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { addSidebar } from "@/redux/reducers/sidebarReducer";

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
  createData(1, "NV1", "Nguyen Van A", "Nhan vien", "Phong nhan su", ""),
  createData(2, "NV2", "Nguyen Thi C", "Ki thuat vien", "Phong sua chua", ""),
  createData(3, "WH3", "Tran Thi B", "Quan ly kho", "Phong kho", ""),
];

const AccountsPage = () => {
  const router = useRouter();

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
      label: "Staff id",
    },
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Full name",
    },
    {
      id: "unit",
      numeric: false,
      disablePadding: false,
      label: "Position",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Department",
    },
    {
      id: "note",
      numeric: false,
      disablePadding: false,
      label: "Note",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addSidebar("account"));
  }, [dispatch]);

  return (
    <div className="assets-page" style={{ height: "calc(100vh - 120px)" }}>
      <div className="assets-page__header">
        <div className="assets-page__header__title">Account</div>
        <div className="assets-page__header__group">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => router.push("CreateAccount")}
          >
            Add account
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
                      onClick={() => router.push("/DetailAccount")}
                      component="th"
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {row.no}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push("/DetailAccount")}
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push("/DetailAccount")}
                      align="left"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push("/DetailAccount")}
                      align="center"
                    >
                      {row.unit}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push("/DetailAccount")}
                      align="center"
                    >
                      {row.status}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push("/DetailAccount")}
                      align="center"
                    >
                      {row.note}
                    </TableCell>
                    <TableCell align="center">
                      <div>
                        <IconButton
                          color="success"
                          onClick={() => router.push("EditAccount")}
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

export default AccountsPage;
