"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useEffect, useRef, useState } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ref = useRef<HTMLDivElement>(null);

  const [collapse, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  useEffect(() => {
    console.log(ref.current?.clientWidth);
    if (
      document.getElementById("app-layout") &&
      document.getElementById("app-layout")!.clientWidth < 1160
    ) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [ref.current?.clientWidth]);

  return (
    <div id={"app-layout"} className="app-layout" ref={ref}>
      <Sidebar collapse={collapse} />
      <div className="app-layout__container">
        <Header onClick={handleCollapse} collapse={collapse} />
        <div className="app-main">{children}</div>
      </div>
    </div>
  );
}
