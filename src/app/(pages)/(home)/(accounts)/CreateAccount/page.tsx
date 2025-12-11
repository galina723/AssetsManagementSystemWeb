"use client";

import { Button, IconButton, TextField, MenuItem } from "@mui/material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";

const CreateAccountPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [roleID, setRoleID] = useState<number | null>(null);
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [gender, setGender] = useState("Male");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const roleList = [
    { name: "General Manager", value: 2 },
    { name: "Assets Manager", value: 3 },
    { name: "Warehouse Manager", value: 4 },
    { name: "Staff", value: 5 },
    { name: "Technical Staff", value: 6 },
    { name: "Warehouse Staff", value: 7 },
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        roleID,
        email,
        fullName,
        password,
        department,
        dateOfBirth: birthday ? birthday.toISOString() : null,
        phoneNumber: phone,
        gender,
        username,
        note,
      };

      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Create account success!");
      router.push("/Accounts");
    } catch (err) {
      console.log(err);
      alert("Create failed!");
    }
  };

  return (
    <>
      <div className="page">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <IconButton onClick={() => router.push("/accounts")}>
              <ArrowBackIcon />
            </IconButton>
            <span>Create New Account</span>
          </div>

          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

        {/* FORM CARD */}
        <div className="card">
          <div className="grid">
            {/* FULL NAME */}
            <div className="field">
              <label>Full Name</label>
              <TextField
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* USERNAME */}
            <div className="field">
              <label>Username</label>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label>Password</label>
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ROLE */}
            <div className="field">
              <label>Role</label>
              <TextField
                select
                value={roleID ?? ""}
                onChange={(e) => setRoleID(Number(e.target.value))}
              >
                {roleList.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* DEPARTMENT — TEXT INPUT */}
            <div className="field">
              <label>Department</label>
              <TextField
                placeholder="Enter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            {/* BIRTHDAY */}
            <div className="field">
              <label>Birthday</label>
              <div className="datepicker">
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={birthday}
                    onChange={(v) => setBirthday(v)}
                  />
                </DemoContainer>
              </div>
            </div>

            {/* PHONE — TEXT INPUT */}
            <div className="field">
              <label>Phone Number</label>
              <TextField
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="field">
              <label>Email</label>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* GENDER */}
            <div className="field">
              <label>Gender</label>
              <TextField
                select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </div>

            {/* NOTE */}
            <div className="field full">
              <label>Note</label>
              <TextField
                multiline
                minRows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================== STYLE ================== */}
      <style jsx>{`
        .page {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: #f7f8fa;
          height: 100%;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 600;
        }

        .card {
          background: white;
          padding: 28px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field.full {
          grid-column: span 2;
        }

        label {
          font-size: 15px;
          font-weight: 600;
          color: #344054;
        }

        .datepicker {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default CreateAccountPage;
