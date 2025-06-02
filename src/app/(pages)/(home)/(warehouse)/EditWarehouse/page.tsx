"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DynamicModel } from "@/models/dynamicModel";
import Dropdown from "@/components/Dropdown";

const EditWarehousePage = () => {
  const router = useRouter();

  const locationData: DynamicModel[] = [
    { name: "Binh Duong", value: "Binh Duong" },
    { name: "Thu Dau Mot", value: "Thu Dau Mot" },
    { name: "Tan Uyen", value: "Tan Uyen" },
    { name: "TP Ho Chi Minh", value: "TP Ho Chi Minh" },
  ];

  const formData = {
    warehouseName: "Kho Bình Dương",
    code: "BD-001",
    quality: "High",
    location: "Binh Duong",
    note: "Kho chính của công ty tại Bình Dương.",
  };

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Warehouse")}>
            <ArrowBackIcon />
          </IconButton>
          <span>Edit Warehouse</span>
        </div>
        <div className="assets-page__header__group">
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={() => {
              // Xử lý lưu dữ liệu, ví dụ gửi API
              console.log("Save data:", formData);
            }}
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
          <TextField
            className="assets-page__container__group--input"
            value={formData.warehouseName}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Code: </span>
          <TextField
            className="assets-page__container__group--input"
            value={formData.code}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Quality:{" "}
          </span>
          <TextField
            className="assets-page__container__group--input"
            value={formData.quality}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Location:{" "}
          </span>
          <Dropdown listData={locationData} defaultValue={formData.location} />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField
            multiline
            className="assets-page__container__group--input"
            value={formData.note}
          />
        </div>
      </div>
    </div>
  );
};

export default EditWarehousePage;
