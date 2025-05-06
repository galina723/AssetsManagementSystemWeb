import React, { FC } from "react";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = (props) => {
  const { collapse = false } = props;

  return (
    <div className="app-sidebar" style={{ width: collapse ? 0 : 250 }}>
      <a className="app-sidebar__logo" href="#">
        <Image
          src="/logos/logo.png"
          alt={""}
          width={collapse ? 0 : 200}
          height={60}
        />
      </a>
      <div className="app-sidebar__menu">
        <a className="app-sidebar__menu__item" href="#">
          <MenuIcon />
          Menu 1
        </a>
        <a className="app-sidebar__menu__item" href="#">
          <MenuIcon />
          Menu 2
        </a>
        <a className="app-sidebar__menu__item" href="#">
          <MenuIcon />
          Menu 3
        </a>
        <a className="app-sidebar__menu__item" href="#">
          <MenuIcon />
          Menu 4
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
