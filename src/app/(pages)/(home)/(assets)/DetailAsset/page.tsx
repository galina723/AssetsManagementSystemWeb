"use client";

import React from "react";
import { IconButton, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const DetailAssetPage = () => {
  const router = useRouter();

  const assetDetail = {
    deviceName: "Laptop Dell XPS 15",
    code: "XPS15-001",
    currency: "VND",
    user: "Nguyen Van A",
    department: "R&D department",
    purchaseDate: "2023-08-15",
    quantity: 5,
    price: 35000000,
    unit: "VND",
    note: "Dùng để phát triển phần mềm",
    purpose: "Làm việc tại văn phòng",
    guarantee: "12 tháng",
    supplier: "FPT Shop",
  };

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
          <IconButton onClick={() => router.push("/Assets")}>
            <ArrowBackIcon />
          </IconButton>
          <div className="assets-page__header__title">Asset Detail</div>
        </div>
      </div>

      <div
        className="assets-page__container"
        style={{
          padding: 16,
          height: "calc(100vh - (64px + 24px + 64px + 24px + 64px))",
        }}
      >
        {renderItem("Device Name", assetDetail.deviceName)}
        {renderItem("Code", assetDetail.code)}
        {renderItem("Currency", assetDetail.currency)}
        {renderItem("User", assetDetail.user)}
        {renderItem("Department", assetDetail.department)}
        {renderItem("Date Of Purchase", assetDetail.purchaseDate)}
        {renderItem("Quantity", assetDetail.quantity)}
        {renderItem("Price", assetDetail.price.toLocaleString("vi-VN"))}
        {renderItem("Unit", assetDetail.unit)}
        {renderItem("Note", assetDetail.note)}
        {renderItem("Purpose", assetDetail.purpose)}
        {renderItem("Guarantee Condition", assetDetail.guarantee)}
        {renderItem("Supplier", assetDetail.supplier)}
      </div>
    </div>
  );
};

export default DetailAssetPage;
