"use client";

import { authSelector } from "@/redux/reducers/auth_reducer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginPage from "./(auth)/(Login)/page";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = useSelector(authSelector);

  const [isAuthed, setIsAuthed] = useState(isAuth.authData.toString());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthStatus = localStorage.getItem("auth");
    setIsAuthed(isAuthStatus);
    if (!isAuthStatus) {
      localStorage.setItem("auth", "false");
    }
    setIsLoading(false);
  }, [isAuth]);

  return isLoading ? (
    <div></div>
  ) : (
    <>{isAuthed == "true" ? <>{children}</> : <LoginPage />}</>
  );
}
