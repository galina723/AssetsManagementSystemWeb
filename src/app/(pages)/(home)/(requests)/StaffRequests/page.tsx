"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

export default function RequestReportPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const [form, setForm] = useState({
    description: "",
    status: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ================= FETCH DATA =================
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

  // ================= ACTIONS =================
  const openAdd = () => {
    setEditId(null);
    setForm({ description: "", status: 0 });
    setOpenModal(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({ description: item.description, status: item.status });
    setOpenModal(true);
  };

  const openViewDetail = (item: any) => {
    setViewingReport(item);
    setOpenDetail(true);
  };

  const handleSubmit = async () => {
    alert(editId ? "⚠ EDIT UI demo" : "⚠ ADD UI demo");
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
                  <td style={pastelStyles.td}>{renderStatus(r.status)}</td>
                  <td style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}>
                    <button
                      style={{
                        ...pastelStyles.viewBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      onClick={() => openViewDetail(r)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      style={{
                        ...pastelStyles.editBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      onClick={() => openEdit(r)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{
                        ...pastelStyles.deleteBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      onClick={() => deleteReport(r.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD/EDIT MODAL */}
        {openModal && (
          <div style={pastelStyles.modalOverlay}>
            <div style={pastelStyles.modal}>
              <h2 style={{ marginBottom: 12, color: mainPastelTextColor }}>
                {editId ? "Edit Request" : "Add New Request"}
              </h2>
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

        {/* DETAIL VIEW MODAL */}
        {openDetail && viewingReport && (
          <div
            style={pastelStyles.modalOverlay}
            onClick={() => setOpenDetail(false)}
          >
            <div
              style={pastelStyles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  marginBottom: 20,
                  color: mainPastelTextColor,
                  borderBottom: `2px solid #f0f4ff`,
                  paddingBottom: 10,
                }}
              >
                Request Details
              </h2>

              <div style={pastelStyles.detailGrid}>
                <DetailItem
                  label="Created By"
                  value={viewingReport.createdBy}
                />
                <DetailItem
                  label="Created Date"
                  value={formatDate(viewingReport.createdDate)}
                />
                <DetailItem
                  label="Type"
                  value={
                    viewingReport.type === 4
                      ? "Location Change"
                      : `Type ${viewingReport.type}`
                  }
                />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#8e9aaf",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Status
                  </div>
                  {renderStatus(viewingReport.status)}
                </div>
                <div style={{ gridColumn: "span 2", marginTop: 10 }}>
                  <DetailItem
                    label="Description"
                    value={viewingReport.description || "None"}
                  />
                </div>
              </div>

              <div style={pastelStyles.modalActions}>
                <button
                  style={pastelStyles.cancelBtn}
                  onClick={() => setOpenDetail(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
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
      `}</style>
    </>
  );
}

// Sub-component for Details
function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#8e9aaf",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, color: "#333", fontWeight: 500 }}>
        {value}
      </div>
    </div>
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
  title: { fontSize: "32px", fontWeight: "700", color: mainPastelTextColor },
  addBtn: {
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    border: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(160, 196, 255, 0.15)",
    border: "1px solid #e0e7f2",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    padding: "10px 8px",
    fontWeight: 700,
    borderBottom: "2px solid #eef2ff",
    background: "#f0f4ff",
    textAlign: "left",
  },
  td: { padding: "10px 8px", borderBottom: "1px solid #eef2ff" },
  actionCol: { display: "flex", gap: "6px", justifyContent: "center" },
  iconBtn: {
    padding: 8,
    borderRadius: "50%",
    width: 34,
    height: 34,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: { background: "#eef2ff", color: mainPastelTextColor },
  editBtn: { background: editPastelColor, color: "#7d4600" },
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
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "90%",
    maxWidth: 450,
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  label: { marginTop: 16, marginBottom: 4, fontWeight: 600, display: "block" },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${mainPastelColor}`,
    background: "#f7f9fc",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${mainPastelColor}`,
    background: "#f7f9fc",
    outline: "none",
  },
  modalActions: {
    marginTop: 24,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  saveBtn: {
    padding: "10px 20px",
    background: mainPastelColor,
    borderRadius: 8,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#f0f2f5",
    borderRadius: 8,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
};
