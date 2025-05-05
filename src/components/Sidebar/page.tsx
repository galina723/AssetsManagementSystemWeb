import React, { FC } from "react";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = (props) => {
  const { collapse = false } = props;

  console.log(collapse);

  return (
    <div className="app-sidebar" style={{ width: collapse ? 0 : 250 }}></div>
  );
};

export default Sidebar;
