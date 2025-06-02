import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = (props) => {
  const { collapse = false } = props;

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
        <Link className="app-sidebar__menu__item" href="/">
          <MenuIcon />
          Dashboard
        </Link>
        <Link className="app-sidebar__menu__item" href="/Assets">
          <MenuIcon />
          Assets
        </Link>
        <Link className="app-sidebar__menu__item" href="/Warehouse">
          <MenuIcon />
          Warehouse
        </Link>

        <Link className="app-sidebar__menu__item" href="/Accounts">
          <MenuIcon />
          Account
        </Link>
        <Link className="app-sidebar__menu__item" href="/Works">
          <MenuIcon />
          Work
        </Link>
        <Link className="app-sidebar__menu__item" href="/Requests">
          <MenuIcon />
          Requests
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
