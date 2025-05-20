import React, { FC } from "react";
import IconButton from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";

interface Props {
  onClick: () => void;
  collapse?: boolean;
}

const Header: FC<Props> = (props) => {
  const { onClick, collapse = false } = props;

  return (
    <div className="app-header">
      <div
        className="app-header__container"
        style={{ width: collapse ? "100vw" : "calc(100vw - 250px)" }}
      >
        <div className="app-header__group app-header__group__left">
          <IconButton aria-label="collapse" onClick={onClick}>
            <MenuIcon />
          </IconButton>
        </div>

        <div className="app-header__group app-header__group__right">
          <Button variant="outlined" startIcon={<AccountCircleIcon />}>
            Nguyen Van A
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
