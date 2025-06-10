"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button, Input } from "@mui/material";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import Link from "next/link";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleTryLogin = () => {
    if (userName == "1" && password == "1") {
      dispatch(addAuth(true));
      localStorage.setItem("auth", "true");
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <Image
          src="/images/background_auth.png"
          alt={""}
          width={1000}
          height={600}
          style={{
            objectFit: "cover",
            // width: "calc(100vh *1.2)",
            height: "60%",
          }}
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
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              className="auth__container--content__input"
              required
            ></Input>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
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
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
