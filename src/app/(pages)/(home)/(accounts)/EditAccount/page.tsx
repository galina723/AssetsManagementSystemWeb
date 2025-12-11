"use client";

import { Button, IconButton, TextField, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const EditAccountPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // lấy ?id=21

  const [fullName, setFullName] = useState("");
  const [roleID, setRoleID] = useState<number | null>(null);
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");

  // MAP role string từ API -> roleID của bạn
  const roleMap: any = {
    "General Manager": 2,
    "Assets Manager": 3,
    "Warehouse Manager": 4,
    Staff: 5,
    "Technical Staff": 6,
    "Warehouse Staff": 7,
  };

  const roleList = [
    { name: "General Manager", value: 2 },
    { name: "Assets Manager", value: 3 },
    { name: "Warehouse Manager", value: 4 },
    { name: "Staff", value: 5 },
    { name: "Technical Staff", value: 6 },
    { name: "Warehouse Staff", value: 7 },
  ];

  // ============================
  // FETCH ACCOUNT
  // ============================
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const a = res.data.data; // <-- API TRẢ VỀ res.data.data !!!

        setFullName(a.fullName);
        setEmail(a.email);
        setUsername(a.username);
        setDepartment(a.department);
        setGender(a.gender);
        setPhone(a.phone);
        setNote(a.note || "");
        setBirthday(a.dateOfBirth);

        // map string role → roleID (5,6,7...)
        setRoleID(roleMap[a.role]);
      } catch (err) {
        console.log(err);
        alert("Cannot load account");
      }
    };

    if (id) fetchAccount();
  }, [id]);

  // ============================
  // UPDATE ROLE
  // ============================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = { roleID };

      await axios.put(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Update success!");
      router.push("/Accounts");
    } catch (err) {
      console.log(err);
      alert("Update failed!");
    }
  };

  return (
    <>
      <div className="page">
        <div className="header">
          <div className="header-left">
            <IconButton onClick={() => router.push("/accounts")}>
              <ArrowBackIcon />
            </IconButton>
            <span>Edit Account</span>
          </div>

          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

        {/* CARD */}
        <div className="card">
          <div className="grid">
            <div className="field">
              <label>Full Name</label>
              <TextField disabled value={fullName} />
            </div>

            <div className="field">
              <label>Username</label>
              <TextField disabled value={username} />
            </div>

            <div className="field">
              <label>Email</label>
              <TextField disabled value={email} />
            </div>

            <div className="field">
              <label>Department</label>
              <TextField disabled value={department} />
            </div>

            <div className="field">
              <label>Birthday</label>
              <TextField disabled value={birthday} />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <TextField disabled value={phone} />
            </div>

            <div className="field">
              <label>Gender</label>
              <TextField disabled value={gender} />
            </div>

            {/* ONLY ROLE EDITABLE */}
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

            <div className="field full">
              <label>Note</label>
              <TextField disabled multiline minRows={3} value={note} />
            </div>
          </div>
        </div>
      </div>

      {/* STYLE */}
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
      `}</style>
    </>
  );
};

export default EditAccountPage;
