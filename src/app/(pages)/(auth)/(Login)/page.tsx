"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input } from "@mui/material";
import Link from "next/link";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    const getToken = localStorage.getItem("token");
    if (!getToken) {
      setLoading(false);
      return;
    } else {
      window.location.href = "/home";
    }
    setLoading(false);
  };

  const handleTryLogin = async () => {
    setLoginLoading(true);
    try {
      const response = await AuthService.login({
        username: username,
        password: password,
      });

      if (response === "fail") {
        alert("Login Failed");
        return;
      }

      const result = response.data;

      // ⭐ Lưu Full User Info theo UserModel
      if (result.success && result.token && result.user) {
        dispatch(addAuth(true));
        localStorage.setItem("auth", "true");
        window.location.href = "/home";
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      alert("Login Error");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="auth">
      <div className="auth__container">
        <Image
          src="/images/background_auth.png"
          alt=""
          width={1000}
          height={600}
          style={{ objectFit: "cover", height: "60%" }}
          className="auth__container--image"
        />

        <div className="auth__container--content">
          <div className="auth__container--content--section auth__container--content--section-1">
            <div className="auth__container--content__title">Sign in</div>
            <div className="auth__container--content__sub-title">
              Welcome to AMS
            </div>
          </div>

          <div className="auth__container--content--section auth__container--content--section-2">
            <Input
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="auth__container--content__input"
            ></Input>

            <Input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="auth__container--content__input"
            ></Input>
          </div>

          <div className="auth__container--content--section auth__container--content--section-3">
            <div className="auth__container--content__forgot">
              <Link href="#" className="auth__container--content__forgot--btn">
                <i>Forgot password?</i>
              </Link>
            </div>

            <Button
              onClick={handleTryLogin}
              variant="contained"
              className="auth__container--content__login--btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing In..." : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
