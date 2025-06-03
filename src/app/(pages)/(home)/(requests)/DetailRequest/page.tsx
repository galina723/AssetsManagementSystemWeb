"use client";

import { IconButton } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const mockRequests = {
  id: "RQ2",
  name: "Liquidation PC intel 7250H",
  unit: "Nguyen Tran Hoang A",
  status: "Done",
  note: "30/07/2025",
};

const DetailRequestsPage = () => {
  const router = useRouter();

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Requests")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Requests Detail</span>
        </div>
      </div>

      <div
        className="assets-page__container"
        style={{ height: "calc(100vh - (64px + 24px + 64px + 24px + 64px))" }}
      >
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Requests ID:{" "}
          </span>
          <span>{mockRequests.id}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Name: </span>
          <span>{mockRequests.name}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Handler:{" "}
          </span>
          <span>{mockRequests.unit}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Status: </span>
          <span>{mockRequests.status}</span>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Created Date:{" "}
          </span>
          <span>{mockRequests.note}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailRequestsPage;
