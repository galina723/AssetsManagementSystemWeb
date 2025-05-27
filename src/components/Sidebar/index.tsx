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
      <Link className="app-sidebar__logo" href="/home">
        <Image
          src="/logos/logo.png"
          alt={""}
          width={collapse ? 0 : 200}
          height={60}
        />
      </Link>
      <div className="app-sidebar__menu">
        <Link className="app-sidebar__menu__item" href="/home">
          <MenuIcon />
          Dashboard
        </Link>
        <Link className="app-sidebar__menu__item" href="/assets">
          <MenuIcon />
          Assets
        </Link>
        <Link className="app-sidebar__menu__item" href="/Warehouse">
          <MenuIcon />
          Warehouse
        </Link>

        <Link className="app-sidebar__menu__item" href="#">
          <MenuIcon />
          Menu 4
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
