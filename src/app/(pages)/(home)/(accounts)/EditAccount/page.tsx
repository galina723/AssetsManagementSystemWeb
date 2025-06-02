"use client";

import { Button, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DynamicModel } from "@/models/dynamicModel";
import Dropdown from "@/components/Dropdown";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const EditAccountPage = () => {
  const router = useRouter();

  const positionData: DynamicModel[] = [
    { name: "Admin", value: "Admin" },
    { name: "Manager", value: "Manager" },
    { name: "Staff", value: "Staff" },
  ];

  const departmentData: DynamicModel[] = [
    { name: "R&D department", value: "R&D department" },
    { name: "HR department", value: "HR department" },
    { name: "Fixing department", value: "Fixing department" },
  ];

  // State lưu thông tin tài khoản (dữ liệu mẫu để hiển thị)
  const [accountData, setAccountData] = useState({
    fullName: "Nguyen Van A",
    position: "Manager",
    department: "HR department",
    birthday: dayjs("1990-05-15"),
    phone: "0123456789",
    email: "nguyenvana@example.com",
    note: "This is a sample note.",
  });

  // Hàm update state chung cho các TextField
  const handleChangeText = (field: string, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }));
  };

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
            onClick={() => {
              // Xử lý lưu dữ liệu ở đây, ví dụ gửi lên API
              console.log("Save data:", accountData);
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
            Full name:{" "}
          </span>
          <TextField
            className="assets-page__container__group--input"
            value={accountData.fullName}
            onChange={(e) => handleChangeText("fullName", e.target.value)}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Position:{" "}
          </span>
          <Dropdown
            listData={positionData}
            defaultValue={accountData.position}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            Department:{" "}
          </span>
          <Dropdown
            listData={departmentData}
            defaultValue={accountData.department}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">
            BirthDay:{" "}
          </span>
          <div className="date-picker">
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Basic date picker"
                value={accountData.birthday}
              />
            </DemoContainer>
          </div>
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Phone: </span>
          <TextField
            className="assets-page__container__group--input"
            value={accountData.phone}
            onChange={(e) => handleChangeText("phone", e.target.value)}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Email: </span>
          <TextField
            className="assets-page__container__group--input"
            value={accountData.email}
            onChange={(e) => handleChangeText("email", e.target.value)}
          />
        </div>

        <div className="assets-page__container__group">
          <span className="assets-page__container__group--label">Note: </span>
          <TextField
            multiline
            className="assets-page__container__group--input"
            value={accountData.note}
            onChange={(e) => handleChangeText("note", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditAccountPage;
