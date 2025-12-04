"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import { sidebarSelector } from "@/redux/reducers/sidebarReducer";
import { useSelector } from "react-redux";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = (props) => {
  const { collapse = false } = props;
  const paramLoc = useSelector(sidebarSelector);

  console.log(paramLoc);

  return (
    <div className="app-sidebar" style={{ width: collapse ? 0 : 250 }}>
      <Link className="app-sidebar__logo" href="/">
        <Image
          src="/logos/logo.jpg"
          alt={""}
          width={collapse ? 0 : 200}
          height={60}
        />
      </Link>
      <div className="app-sidebar__menu">
        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "home" && "app-sidebar__menu__item--active"
          }`}
          href="/"
        >
          <MenuIcon />
          Dashboard
        </Link>
        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "asset" && "app-sidebar__menu__item--active"
          }`}
          href="/Assets"
        >
          <MenuIcon />
          Assets
        </Link>
        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "warehouse" &&
            "app-sidebar__menu__item--active"
          }`}
          href="/Warehouse"
        >
          <MenuIcon />
          Warehouse
        </Link>

        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "account" &&
            "app-sidebar__menu__item--active"
          }`}
          href="/Accounts"
        >
          <MenuIcon />
          Account
        </Link>
        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "work" && "app-sidebar__menu__item--active"
          }`}
          href="/Works"
        >
          <MenuIcon />
          Work
        </Link>
        <Link
          className={`app-sidebar__menu__item ${
            paramLoc.sidebarData == "request" &&
            "app-sidebar__menu__item--active"
          }`}
          href="/Requests"
        >
          <MenuIcon />
          Requests
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
