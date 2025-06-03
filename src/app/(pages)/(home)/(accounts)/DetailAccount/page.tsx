"use client";

import React from "react";
import { IconButton, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const mockAccount = {
  fullName: "Nguyễn Văn A",
  position: "Software Engineer",
  department: "IT Department",
  birthDay: "1995-08-15",
  phone: "0123456789",
  email: "nguyenvana@example.com",
  note: "This is a key account member.",
};

const DetailAccountPage = () => {
  const router = useRouter();

  const renderItem = (label: string, value: string | number) => (
    <div className="assets-page__container__group">
      <Typography
        variant="subtitle2"
        className="assets-page__container__group--label"
      >
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
      <Divider style={{ marginTop: 8 }} />
    </div>
  );

  return (
    <div className="assets-page">
      <div className="assets-page__header">
        <div className="assets-page__header__title assets-page__header__title__group">
          <IconButton onClick={() => router.push("/Accounts")}>
            <ArrowBackIcon />
          </IconButton>
          <div className="assets-page__header__title">Account Detail</div>
        </div>
      </div>

      <div
        className="assets-page__container"
        style={{
          padding: 16,
          height: "calc(100vh - (64px + 24px + 64px + 24px + 64px))",
        }}
      >
        {renderItem("Full Name", mockAccount.fullName)}
        {renderItem("Position", mockAccount.position)}
        {renderItem("Department", mockAccount.department)}
        {renderItem("Birthday", mockAccount.birthDay)}
        {renderItem("Phone", mockAccount.phone)}
        {renderItem("Email", mockAccount.email)}
        {renderItem("Note", mockAccount.note)}
      </div>
    </div>
  );
};

export default DetailAccountPage;
