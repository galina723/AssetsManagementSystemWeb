"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const CreateAssetsPage = () => {
  const router = useRouter();

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Accounts")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Edit Account</span>
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
            Full name:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Position:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Department:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            BirthDay:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
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
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetsPage;
