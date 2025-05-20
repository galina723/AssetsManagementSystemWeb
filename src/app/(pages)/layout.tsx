"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { authSelector } from "@/redux/reducers/auth_reducer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginPage from "./(auth)/login/page";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = useSelector(authSelector);

  const [collapse, setCollapsed] = useState(false);
  const [isAuthed, setIsAuthed] = useState(isAuth.authData.toString());

  useEffect(() => {
    const isAuthStatus = localStorage.getItem("auth");
    setIsAuthed(isAuthStatus);
  }, [isAuth]);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  return (
    <div className="app-layout">
      {isAuthed == "true" ? (
        <>
          <Sidebar collapse={collapse} />
          <div className="app-layout__container">
            <Header onClick={handleCollapse} collapse={collapse} />
            <div className="app-main">{children}</div>
          </div>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
