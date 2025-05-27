"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapse, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  return (
    <div className="app-layout">
      <Sidebar collapse={collapse} />
      <div className="app-layout__container">
        <Header onClick={handleCollapse} collapse={collapse} />
        <div className="app-main">{children}</div>
      </div>
    </div>
  );
}
