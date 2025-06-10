import React, { FC } from "react";
import IconButton from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";
import { addAuth } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";

interface Props {
  onClick: () => void;
  collapse?: boolean;
}

const Header: FC<Props> = (props) => {
  const { onClick, collapse = false } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.setItem("auth", "false");
    dispatch(addAuth(false));
    window.location.reload();
    setAnchorEl(null);
  };

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
          <Button
            variant="outlined"
            startIcon={<AccountCircleIcon />}
            onClick={handleClick}
          >
            Nguyen Van A
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
