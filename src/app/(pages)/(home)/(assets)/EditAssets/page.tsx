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
import dayjs from "dayjs";

const EditAssetsPage = () => {
  const router = useRouter();

  const departmentData: DynamicModel[] = [
    { name: "R&D department", value: "R&D department" },
    { name: "HR department", value: "HR department" },
    { name: "Fixing department", value: "Fixing department" },
  ];

  const userData: DynamicModel[] = [
    { name: "Nguyen Van A", value: "Nguyen Van A" },
    { name: "Nguyen Thi C", value: "Nguyen Thi C" },
    { name: "Tran Van D", value: "Tran Van D" },
  ];

  const unitData: DynamicModel[] = [
    { name: "VND", value: "VND" },
    { name: "USD", value: "USD" },
  ];

  const formData = {
    name: "PC Dell Optiplex",
    code: "PC-223",
    currency: "VND",
    user: "Nguyen Van A",
    department: "R&D department",
    dateOfPurchase: dayjs("2024-06-01"),
    quantity: "10",
    price: "12000000",
    unit: "VND",
    note: "Used in R&D lab",
    purpose: "Development workstation",
    guarantee: "12 months",
    supplier: "FPT Shop",
  };

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
          <TextField
            value={formData.name}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Code: </span>
          <TextField
            value={formData.code}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Currency:{" "}
          </span>
          <TextField
            value={formData.currency}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">User: </span>
          <Dropdown listData={userData} defaultValue={formData.user} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Department:{" "}
          </span>
          <Dropdown
            listData={departmentData}
            defaultValue={formData.department}
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Date Of Purchase:{" "}
          </span>
          <div className="date-picker">
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Basic date picker"
                value={formData.dateOfPurchase}
              />
            </DemoContainer>
          </div>
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Quantity:{" "}
          </span>
          <TextField
            value={formData.quantity}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Price: </span>
          <TextField
            value={formData.price}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Unit: </span>
          <Dropdown listData={unitData} defaultValue={formData.unit} />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField
            multiline
            value={formData.note}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Purpose:{" "}
          </span>
          <TextField
            value={formData.purpose}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Guarantee Condition:{" "}
          </span>
          <TextField
            value={formData.guarantee}
            className="assets-page__container__group--input"
          />
        </div>
        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Supplier:{" "}
          </span>
          <TextField
            value={formData.supplier}
            className="assets-page__container__group--input"
          />
        </div>
      </div>
    </div>
  );
};

export default EditAssetsPage;
