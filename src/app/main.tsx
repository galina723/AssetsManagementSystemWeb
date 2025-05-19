"use client";

import Header from "@/components/Header/page";
import Sidebar from "@/components/Sidebar/page";
import LoginPage from "@/pages/(auth)/login/page";
import HomePage from "@/pages/home/page";
import { authSelector } from "@/reduxs/reducers/auth_reducer";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Main() {
  const isAuth = useSelector(authSelector);

  const [collapse, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  return (
    <div className="app-layout">
      {isAuth.authData ? (
        <>
          <Sidebar collapse={collapse} />
          <div className="app-layout__container">
            <Header onClick={handleCollapse} collapse={collapse} />
            <div className="app-main">
              <HomePage />
            </div>
          </div>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
