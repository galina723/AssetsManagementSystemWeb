"use client";

import Header from "@/components/Header/page";
import Sidebar from "@/components/Sidebar/page";
import HomePage from "@/pages/home/pages";
import { useState } from "react";

export default function Home() {
  const [collapse, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  return (
    <div className="app-layout">
      <Sidebar collapse={collapse} />
      <div className="app-layout__container">
        <Header onClick={handleCollapse} collapse={collapse} />
        <div className="app-main">
          <HomePage />
        </div>
      </div>
    </div>
  );
}
