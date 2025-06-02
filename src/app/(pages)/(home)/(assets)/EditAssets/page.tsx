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
          <IconButton onClick={() => router.push("/Assets")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Edit Assets</span>
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
            Date Of Purchase:{" "}
          </span>
          <TextField className="assets-page__container__group--input"></TextField>
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
          <TextField className="assets-page__container__group--input"></TextField>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField className="assets-page__container__group--input"></TextField>
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
