"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DynamicModel } from "@/models/dynamicModel";
import Dropdown from "@/components/Dropdown";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";

const CreateAssetsPage = () => {
  const router = useRouter();

  const departmentData: DynamicModel[] = [
    {
      name: "R&D department",
      value: "R&D department",
    },
    {
      name: "HR department",
      value: "HR department",
    },
    {
      name: "Fixing department",
      value: "Fixing department",
    },
  ];

  const userData: DynamicModel[] = [
    {
      name: "Nguyen Van A",
      value: "Nguyen Van A",
    },
    {
      name: "Nguyen Thi C",
      value: "Nguyen Thi C",
    },
    {
      name: "Tran Van D",
      value: "Tran Van D",
    },
  ];

  const unitData: DynamicModel[] = [
    {
      name: "VND",
      value: "VND",
    },
    {
      name: "USD",
      value: "USD",
    },
  ];

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Assets")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Create Assets</span>
        </div>
        <div className="assets-page__header__group">
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={() => {}}
          >
            Save
          </Button>
        </div>
      </div>

      <div
        className="assets-page__container"
        style={{ height: "calc(100vh - (64px + 24px + 64px + 24px + 64px))" }}
      >
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Device name:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Code: </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Currency:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">User: </span>
          <Dropdown listData={userData} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Department:{" "}
          </span>
          <Dropdown listData={departmentData} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Date Of Purchase:{" "}
          </span>
          <div className="date-picker">
            <DemoContainer components={["DatePicker"]}>
              <DatePicker label="Choose date" />
            </DemoContainer>
          </div>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Quantity:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Price: </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Unit: </span>
          <Dropdown listData={unitData} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField
            multiline
            className="assets-page__container__group--input"
          ></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Purpose:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Guarantee Condition:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Supplier:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetsPage;
