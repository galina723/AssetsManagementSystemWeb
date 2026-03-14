"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";

// Cấu hình màu sắc cho các loại Request (Type)
const RequestTypeConfig: Record<number, string> = {
  0: "Broken",
  1: "Recall",
  2: "Lost",
  3: "Report",
  4: "Location Change",
  5: "Wh. Delete",
};

export default function MyRequestsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [openDetail, setOpenDetail] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ================= FETCH DATA =================
  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/requestreport/created-list-request",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
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
  const openViewDetail = (item: any) => {
    setViewingReport(item);
    setOpenDetail(true);
  };

  if (loading)
    return (
      <div style={pastelStyles.container}>
        <div style={{ fontSize: 18, color: mainPastelTextColor }}>
          Loading...
        </div>
      </div>
    );

  return (
    <>
      <div style={pastelStyles.container}>
        {/* HEADER */}
        <div style={pastelStyles.header}>
          <div>
            <h1 style={pastelStyles.title}>My Requests</h1>
          </div>
          <button style={pastelStyles.addBtn} className="add-btn-style">
            <FaPlus size={12} style={{ marginRight: 6 }} /> Create Request
          </button>
        </div>

        {/* TABLE */}
        <div style={pastelStyles.card}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>#</th>
                <th style={pastelStyles.th}>type of request</th>
                <th style={pastelStyles.th}>Description</th>
                <th style={pastelStyles.th}>Date</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => (
                <tr key={r.id} className="table-row-style">
                  <td style={{ ...pastelStyles.td, textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={pastelStyles.td}>
                    <span style={pastelStyles.typeBadge}>
                      {RequestTypeConfig[r.type] || `Type ${r.type}`}
                    </span>
                  </td>
                  <td style={pastelStyles.td}>
                    <div style={pastelStyles.truncate}>{r.description}</div>
                  </td>
                  <td style={pastelStyles.td}>
                    {new Date(r.createdDate).toLocaleDateString("vi-VN")}
                  </td>
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
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{
                        ...pastelStyles.deleteBtn,
                        ...pastelStyles.iconBtn,
                      }}
                      onClick={() => confirm("Xóa yêu cầu này?")}
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
              <h2 style={pastelStyles.modalTitle}>Request Details</h2>

              <div style={pastelStyles.detailGrid}>
                <DetailItem
                  label="Loại yêu cầu"
                  value={RequestTypeConfig[viewingReport.type] || "N/A"}
                />
                <DetailItem
                  label="Ngày gửi"
                  value={new Date(viewingReport.createdDate).toLocaleString(
                    "vi-VN",
                  )}
                />
                <div>
                  <div style={pastelStyles.detailLabel}>Trạng thái</div>
                  {renderStatus(viewingReport.status)}
                </div>
                <DetailItem
                  label="ID Người tạo"
                  value={viewingReport.createdBy}
                />

                <div style={{ gridColumn: "span 2", marginTop: 10 }}>
                  <DetailItem
                    label="Nội dung mô tả"
                    value={viewingReport.description || "Không có mô tả"}
                  />
                </div>
              </div>

              <div style={pastelStyles.modalActions}>
                <button
                  style={pastelStyles.cancelBtn}
                  onClick={() => setOpenDetail(false)}
                >
                  Đóng
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
          transition: all 0.2s;
        }
      `}</style>
    </>
  );
}

// Helpers
function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={pastelStyles.detailLabel}>{label}</div>
      <div style={{ fontSize: 15, color: "#333", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function renderStatus(s: number) {
  const map: any = {
    0: { text: "Pending", bg: "#fff3cd", color: "#9c6e00" },
    1: { text: "Approved", bg: "#caffbf", color: "#1f5700" },
    2: { text: "Rejected", bg: "#ffadad", color: "#610000" },
  };
  const status = map[s] || map[0];
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        background: status.bg,
        color: status.color,
        fontSize: 12,
        fontWeight: 700,
        display: "inline-block",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      {status.text}
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
    background: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: mainPastelTextColor,
    margin: 0,
  },
  addBtn: {
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignItems: "center",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(160, 196, 255, 0.15)",
    border: "1px solid #e0e7f2",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "14px 12px",
    fontWeight: 700,
    borderBottom: "2px solid #eef2ff",
    background: "#f0f4ff",
    textAlign: "left",
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #eef2ff",
    fontSize: "14px",
  },
  truncate: {
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  actionCol: { display: "flex", gap: "8px", justifyContent: "center" },
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
    background: "#e0e7ff",
    color: "#4338ca",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "11px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "95%",
    maxWidth: 500,
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 20px 25px rgba(0,0,0,0.1)",
  },
  modalTitle: {
    marginBottom: 20,
    color: mainPastelTextColor,
    borderBottom: `2px solid #f0f4ff`,
    paddingBottom: 10,
    fontSize: "20px",
    fontWeight: 800,
  },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  detailLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#8e9aaf",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalActions: { marginTop: 24, display: "flex", justifyContent: "flex-end" },
  cancelBtn: {
    padding: "10px 24px",
    background: "#f0f2f5",
    borderRadius: 10,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    color: "#475569",
  },
};
