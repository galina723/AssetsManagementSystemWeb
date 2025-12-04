"use client";

import { WorkModel } from "@/models/work/workModel";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import { WorkService } from "@/services/workService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

const WorkPage = () => {
  const [listWorkData, setListWorkData] = useState<WorkModel[]>([]);

  useEffect(() => {
    getListWorkData();
  }, []);

  const getListWorkData = async () => {
    const work = await WorkService.getAllWork();
    console.log("work", work);
    if (work !== "fail") {
      setListWorkData(work);
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
  ];

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addSidebar("work"));
  }, [dispatch]);

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
              {listWorkData.map((row: WorkModel, i: number) => {
                return (
                  <TableRow
                    hover
                    onClick={() => router.push("/DetailWork")}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.workID}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      align="center"
                      scope="row"
                      padding="none"
                    >
                      {i + 1}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.workID}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{row.assetID}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.assignments}</TableCell>
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
      </div>
    </div>
  );
};

export default WorkPage;
