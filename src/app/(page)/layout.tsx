"use client";

import { authSelector } from "@/redux/reducers/auth_reducer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginPage from "./(auth)/login/page";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = useSelector(authSelector);

  const [isAuthed, setIsAuthed] = useState(isAuth.authData.toString());

  useEffect(() => {
    const isAuthStatus = localStorage.getItem("auth");
    setIsAuthed(isAuthStatus);
  }, [isAuth]);

  return (
    <div className="app-layout">
      {isAuthed == "true" ? <>{children}</> : <LoginPage />}
    </div>
  );
}
