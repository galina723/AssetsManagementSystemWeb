"use client";

import { IconButton } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const mockWork = {
  id: "Wk2",
  name: "Maintenance Air cool",
  unit: "Nguyen Tran Hoang A",
  status: "Done",
  note: "30/07/2025",
};

const DetailWorkPage = () => {
  const router = useRouter();

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Works")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Work Detail</span>
        </div>
      </div>

      <div
        className="assets-page__container"
        style={{ height: "calc(100vh - (64px + 24px + 64px + 24px + 64px))" }}
      >
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Work ID:{" "}
          </span>
          <span>{mockWork.id}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Name: </span>
          <span>{mockWork.name}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Handler:{" "}
          </span>
          <span>{mockWork.unit}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Status: </span>
          <span>{mockWork.status}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Created Date:{" "}
          </span>
          <span>{mockWork.note}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailWorkPage;
