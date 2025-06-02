"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import { DynamicModel } from "@/models/dynamicModel";

const CreateWarehousePage = () => {
  const router = useRouter();

  const locationData: DynamicModel[] = [
    {
      name: "Binh Duong",
      value: "Binh Duong",
    },
    {
      name: "Thu Dau Mot",
      value: "Thu Dau Mot",
    },
    {
      name: "Tan Uyen",
      value: "Tan Uyen",
    },
    {
      name: "TP Ho Chi Minh",
      value: "TP Ho Chi Minh",
    },
  ];

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Warehouse")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Create Warehouse</span>
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
        style={{ height: "calc(100vh - (64px + 24px + 64px + 24px))" }}
      >
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Warehouse name:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Code: </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Quality:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Location:{" "}
          </span>
          <Dropdown listData={locationData} />
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

export default CreateWarehousePage;
