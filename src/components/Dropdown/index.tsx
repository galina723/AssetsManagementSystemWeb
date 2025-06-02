import { DynamicModel } from "@/models/dynamicModel";
import { Menu, MenuItem } from "@mui/material";
import React, { FC, useState } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  listData: DynamicModel[];
  defaultValue?: string;
}

const Dropdown: FC<Props> = (props) => {
  const { listData, defaultValue = "" } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState(defaultValue);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="dropdown">
      <div className="dropdown__box" onClick={handleClick}>
        <span>{selected != "" ? selected : "Select"}</span>
        <KeyboardArrowDown />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {listData.length > 0 &&
          listData.map((e, i) => {
            return (
              <MenuItem key={i} onClick={() => setSelected(e.name)}>
                {e.name}
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
};

export default Dropdown;
