"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function RequestReportPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    description: "",
    status: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // GET LIST
  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/requestreport/staff-requestList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setReports(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // OPEN ADD
  const openAdd = () => {
    setEditId(null);
    setForm({
      description: "",
      status: 0,
    });
    setOpenModal(true);
  };

  // OPEN EDIT
  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      description: item.description,
      status: item.status,
    });
    setOpenModal(true);
  };

  // SUBMIT (fake)
  const handleSubmit = async () => {
    console.log("SUBMIT:", form);

    alert(editId ? "⚠ Đây là EDIT UI demo" : "⚠ Đây là ADD UI demo");

    setOpenModal(false);
  };

  const deleteReport = async (id: number) => {
    if (!confirm("Delete this report?")) return;
    alert("⚠ DELETE UI demo");
  };

  if (loading)
    return (
      <div
        style={{
          padding: 40,
          fontSize: 18,
          background: "#fcfcfc",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );

  return (
    <>
      <div style={pastelStyles.container}>
        {/* HEADER */}
        <div style={pastelStyles.header}>
          <h1 style={pastelStyles.title}>Staff Request List</h1>

          <button
            style={pastelStyles.addBtn}
            onClick={openAdd}
            className="add-btn-style"
          >
            + Add Request
          </button>
        </div>

        {/* TABLE */}
        <div style={pastelStyles.card}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.th}>#</th>
                <th style={pastelStyles.th}>Created By</th>
                <th style={pastelStyles.th}>Created Date</th>
                <th style={pastelStyles.th}>Type</th>
                <th style={pastelStyles.th}>Description</th>{" "}
                <th style={pastelStyles.th}>Status</th>
                <th style={pastelStyles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r, index) => (
                <tr key={r.id} className="table-row-style">
                  <td style={{ ...pastelStyles.td, textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={pastelStyles.td}>{r.createdBy}</td>
                  <td style={pastelStyles.td}>{formatDate(r.createdDate)}</td>
                  <td style={pastelStyles.td}>{renderType(r.type)}</td>
                  <td style={pastelStyles.td}>{r.description}</td>
                  <td style={pastelStyles.td}>{renderStatus(r.status)}</td>
                  <td style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}>
                    <button
                      style={{
                        ...pastelStyles.editBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      className="edit-icon-btn-style"
                      onClick={() => openEdit(r)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{
                        ...pastelStyles.deleteBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      className="delete-icon-btn-style"
                      onClick={() => deleteReport(r.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {openModal && (
          <div style={pastelStyles.modalOverlay}>
            <div style={pastelStyles.modal}>
              <h2 style={{ marginBottom: 12, color: pastelStyles.title.color }}>
                {editId ? "Edit Request" : "Add New Request"}
              </h2>

              {/* STATUS lên trước */}
              <label style={pastelStyles.label}>Status</label>
              <select
                style={pastelStyles.select}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: Number(e.target.value) })
                }
              >
                <option value={0}>Pending</option>
                <option value={1}>Approved</option>
                <option value={2}>Rejected</option>
              </select>

              {/* DESCRIPTION xuống dưới */}
              <label style={pastelStyles.label}>Description</label>
              <textarea
                style={pastelStyles.textarea}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div style={pastelStyles.modalActions}>
                <button style={pastelStyles.saveBtn} onClick={handleSubmit}>
                  Save
                </button>
                <button
                  style={pastelStyles.cancelBtn}
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GLOBAL SCSS */}
      <style jsx global>{`
        .table-row-style {
          transition: 0.25s;
        }
        .table-row-style:nth-child(even) {
          background-color: #f9fbfd !important;
        }
        .table-row-style:hover {
          background-color: #eef2ff !important;
        }

        .add-btn-style:hover {
          background: linear-gradient(145deg, #a0c4ff, #b8cffc) !important;
          transform: translateY(-1px) !important;
        }

        .delete-icon-btn-style:hover {
          background: #ff8c8c !important;
        }
        .edit-icon-btn-style:hover {
          background: #f7c948 !important;
        }
      `}</style>
    </>
  );
}

// Helpers
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB");
}

function renderType(t: number) {
  return (
    <span style={pastelStyles.typeBadge}>
      {t === 4 ? "Location Change" : `Type ${t}`}
    </span>
  );
}

function renderStatus(s: number) {
  const map: any = {
    0: { text: "Pending", bg: "#fff3cd", color: "#9c6e00" },
    1: { text: "Approved", bg: "#caffbf", color: "#1f5700" },
    2: { text: "Rejected", bg: "#ffadad", color: "#610000" },
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        background: map[s].bg,
        color: map[s].color,
        fontSize: 13,
        fontWeight: 600,
        display: "inline-block",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      {map[s].text}
    </span>
  );
}

// Styles
const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";
const editPastelColor = "#ffd6a5";
const editPastelDark = "#7d4600";

const pastelStyles: any = {
  container: {
    minHeight: "100vh",
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "#fcfcfc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: mainPastelTextColor,
  },
  addBtn: {
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    border: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(160, 196, 255, 0.15)",
    border: "1px solid #e0e7f2",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "10px 8px",
    fontWeight: 700,
    borderBottom: "2px solid #eef2ff",
    background: "#f0f4ff",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #eef2ff",
  },
  actionCol: { display: "flex", gap: "4px", justifyContent: "center" },
  iconBtn: {
    padding: 8,
    borderRadius: "50%",
    width: 35,
    height: 35,
    border: "none",
    cursor: "pointer",
  },
  editBtn: { background: editPastelColor, color: editPastelDark },
  deleteBtn: { background: deletePastelColor, color: "#610000" },
  typeBadge: {
    padding: "4px 10px",
    background: mainPastelColor,
    color: mainPastelTextColor,
    borderRadius: 8,
    fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 450,
    background: "#fff",
    padding: 24,
    borderRadius: 16,
  },
  label: { marginTop: 16, marginBottom: 4, fontWeight: 600 },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${mainPastelColor}`,
    background: "#f7f9fc",
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${mainPastelColor}`,
    background: "#f7f9fc",
  },
  modalActions: {
    marginTop: 30,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  saveBtn: {
    padding: "10px 18px",
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    borderRadius: 8,
    fontWeight: 700,
    border: "none",
  },
  cancelBtn: {
    padding: "10px 18px",
    background: "#d3d9e2",
    borderRadius: 8,
    fontWeight: 600,
    border: "none",
  },
};
