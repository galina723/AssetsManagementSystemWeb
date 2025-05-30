"use client";

import { authSelector } from "@/redux/reducers/auth_reducer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginPage from "./(auth)/(Login)/page";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = useSelector(authSelector);

  const [isAuthed, setIsAuthed] = useState(isAuth.authData.toString());
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const isAuthStatus = localStorage.getItem("auth");
    setIsAuthed(isAuthStatus);
    if (!isAuthStatus) {
      localStorage.setItem("auth", "false");
    }
    setisLoading(false);
  }, [isAuth]);

  const handleCollapse = () => {
    setCollapsed(!collapse);
  };

  return isLoading ? (
    <div></div>
  ) : (
    <>
      {isAuthed == "true" ? (
        <div className="app-layout">
          <Sidebar collapse={collapse} />
          <div className="app-layout__container">
            <Header onClick={handleCollapse} collapse={collapse} />
            <div className="app-main">{children}</div>
          </div>
        </div>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
