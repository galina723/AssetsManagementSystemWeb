"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DynamicModel } from "@/models/dynamicModel";
import Dropdown from "@/components/Dropdown";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const CreateAccountPage = () => {
  const router = useRouter();

  const positionData: DynamicModel[] = [
    {
      name: "Admin",
      value: "Admin",
    },
    {
      name: "Manager",
      value: "Manager",
    },
    {
      name: "Staff",
      value: "Staff",
    },
  ];

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

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Accounts")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Create Account</span>
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
            Full name:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Position:{" "}
          </span>
          <Dropdown listData={positionData} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Department:{" "}
          </span>
          <Dropdown listData={departmentData} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            BirthDay:{" "}
          </span>
          <div className="date-picker">
            <DemoContainer components={["DatePicker"]}>
              <DatePicker label="Choose date" />
            </DemoContainer>
          </div>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Phone: </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Email: </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField
            multiline
            className="assets-page__container__group--input"
          ></TextField>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
