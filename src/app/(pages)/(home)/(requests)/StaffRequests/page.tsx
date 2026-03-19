"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const REPORT_TYPES: { [key: number]: string } = {
  0: "Broken",
  1: "Recall",
  2: "Lost",
  3: "Report",
  4: "Location Change",
  5: "Wh. Delete",
};

export default function RequestReportPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const [form, setForm] = useState({
    requestID: 0,
    newStatus: 1, // Default Accepted
    comment: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ================= FETCH DATA =================
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/requestreport/staff-requestList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      setReports(res.data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // ================= ACTIONS =================
  const openEdit = (item: any) => {
    setForm({
      requestID: item.id,
      newStatus: item.status === 0 ? 1 : item.status,
      comment: "",
    });
    setOpenModal(true);
  };

  const openViewDetail = (item: any) => {
    setViewingReport(item);
    setOpenDetail(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/RequestReport/process-approval",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      alert("Status updated successfully!");
      setOpenModal(false);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  if (loading)
    return (
      <div style={pastelStyles.loadingContainer}>
        <div style={pastelStyles.loaderText}>Loading staff requests...</div>
      </div>
    );

  return (
    <>
      <div style={pastelStyles.container} className="responsive-container">
        {/* HEADER */}
        <div style={pastelStyles.header} className="responsive-header">
          <div>
            <h1 style={pastelStyles.title} className="responsive-title">
              Staff Request Management
            </h1>
          </div>
        </div>

        {/* TABLE CARD */}
        <div style={pastelStyles.card}>
          <div style={pastelStyles.tableWrapper}>
            <table style={pastelStyles.table}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...pastelStyles.th,
                      textAlign: "center",
                      width: "5%",
                    }}
                  >
                    #
                  </th>
                  <th style={pastelStyles.th}>Created By</th>
                  <th style={pastelStyles.th}>Date</th>
                  <th style={pastelStyles.th}>Request Type</th>
                  <th style={pastelStyles.th}>Status</th>
                  <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((r, index) => (
                  <tr key={r.id} className="table-row-style">
                    <td
                      style={{
                        ...pastelStyles.td,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td
                      style={{
                        ...pastelStyles.td,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <FaUser size={12} color="#94a3b8" /> {r.createdBy}
                      </div>
                    </td>
                    <td style={{ ...pastelStyles.td, color: "#64748b" }}>
                      {formatDate(r.createdDate)}
                    </td>
                    <td style={pastelStyles.td}>{renderType(r.type)}</td>
                    <td style={pastelStyles.td}>{renderStatus(r.status)}</td>
                    <td
                      style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}
                    >
                      <button
                        style={{
                          ...pastelStyles.iconBtn,
                          ...pastelStyles.viewBtn,
                        }}
                        onClick={() => openViewDetail(r)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>

                      {r.status === 0 && (
                        <button
                          style={{
                            ...pastelStyles.iconBtn,
                            ...pastelStyles.editBtn,
                          }}
                          onClick={() => openEdit(r)}
                          title="Process Request"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} style={pastelStyles.emptyState}>
                      No requests waiting for review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div
              style={pastelStyles.paginationContainer}
              className="responsive-pagination"
            >
              <div style={pastelStyles.paginationInfo}></div>
              <div style={pastelStyles.paginationButtons}>
                <button
                  style={{
                    ...pastelStyles.pageBtn,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={10} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      style={{
                        ...pastelStyles.pageBtn,
                        background:
                          currentPage === page ? "#3b82f6" : "#ffffff",
                        color: currentPage === page ? "#ffffff" : "#475569",
                        borderColor:
                          currentPage === page ? "#3b82f6" : "#cbd5e1",
                      }}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  style={{
                    ...pastelStyles.pageBtn,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODALS - GIỮ NGUYÊN STYLE NHƯ PERSONAL REQUEST */}
        {openModal && (
          <div
            style={pastelStyles.modalOverlay}
            onClick={() => setOpenModal(false)}
          >
            <div
              style={pastelStyles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={pastelStyles.modalHeader}>
                <h2 style={pastelStyles.modalTitle}>Process Request</h2>
              </div>
              <div style={pastelStyles.modalBody}>
                <label style={pastelStyles.label}>Decision</label>
                <select
                  style={pastelStyles.select}
                  value={form.newStatus}
                  onChange={(e) =>
                    setForm({ ...form, newStatus: Number(e.target.value) })
                  }
                >
                  <option value={1}>Accepted</option>
                  <option value={2}>Rejected</option>
                </select>
                <label style={pastelStyles.label}>Notes / Comment</label>
                <textarea
                  style={pastelStyles.textarea}
                  placeholder="Note the reason for your decision..."
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />
              </div>
              <div style={pastelStyles.modalActions}>
                <button
                  style={pastelStyles.cancelBtn}
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button style={pastelStyles.saveBtn} onClick={handleSubmit}>
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        )}

        {openDetail && viewingReport && (
          <div
            style={pastelStyles.modalOverlay}
            onClick={() => setOpenDetail(false)}
          >
            <div
              style={pastelStyles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={pastelStyles.modalHeader}>
                <h2 style={pastelStyles.modalTitle}>Request Detail</h2>
              </div>
              <div style={pastelStyles.detailGrid}>
                <DetailItem label="Requestor" value={viewingReport.createdBy} />
                <DetailItem
                  label="Date Submitted"
                  value={formatDate(viewingReport.createdDate)}
                />
                <DetailItem
                  label="Type"
                  value={REPORT_TYPES[viewingReport.type]}
                />
                <div>
                  <div style={pastelStyles.detailLabel}>Status</div>
                  {renderStatus(viewingReport.status)}
                </div>
                <div style={{ gridColumn: "span 2", marginTop: 8 }}>
                  <DetailItem
                    label="Content / Reason"
                    value={viewingReport.description || "N/A"}
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
        .table-row-style {
          transition: background-color 0.2s ease;
        }
        .table-row-style:hover {
          background-color: #f8fafc !important;
        }
        .table-row-style:not(:last-child) td {
          border-bottom: 1px solid #f1f5f9;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

// Sub-components & Helpers
function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={pastelStyles.detailLabel}>{label}</div>
      <div style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderType(t: number) {
  return <span style={pastelStyles.typeBadge}>{REPORT_TYPES[t] || t}</span>;
}

function renderStatus(s: number) {
  const map: any = {
    0: { text: "Pending", bg: "#fef3c7", color: "#b45309" },
    1: { text: "Accepted", bg: "#dcfce7", color: "#15803d" },
    2: { text: "Rejected", bg: "#fee2e2", color: "#b91c1c" },
  };
  const m = map[s] || { text: "Unknown", bg: "#f1f5f9", color: "#475569" };
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "16px",
        background: m.bg,
        color: m.color,
        fontSize: "11px",
        fontWeight: 700,
        display: "inline-block",
        minWidth: "75px",
        textAlign: "center",
      }}
    >
      {m.text}
    </span>
  );
}

const pastelStyles: any = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f7fb",
  },
  loaderText: { fontSize: "14px", fontWeight: 600, color: "#64748b" },
  container: {
    minHeight: "100vh",
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    background: "#f4f7fb",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  subtitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(148, 163, 184, 0.08)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "12px 16px",
    fontWeight: 700,
    background: "#f8fafc",
    textAlign: "left",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    borderBottom: "2px solid #e2e8f0",
  },
  td: { padding: "12px 16px", verticalAlign: "middle" },
  actionCol: { display: "flex", gap: "6px", justifyContent: "center" },
  iconBtn: {
    padding: "6px",
    borderRadius: "6px",
    width: "30px",
    height: "30px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  viewBtn: { background: "#e0f2fe", color: "#0284c7" },
  editBtn: { background: "#ffedd5", color: "#c2410c" },
  typeBadge: {
    padding: "4px 8px",
    background: "#e0e7ff",
    color: "#4338ca",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "11px",
  },
  emptyState: {
    padding: "30px",
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid #f1f5f9",
    background: "#ffffff",
  },
  paginationInfo: { fontSize: "13px", color: "#64748b" },
  paginationButtons: { display: "flex", gap: "6px" },
  pageBtn: {
    minWidth: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "12px",
    fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
    animation: "fadeIn 0.2s",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
  },
  modalSubtitle: { margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" },
  modalBody: { padding: "20px" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    padding: "20px",
  },
  detailLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "6px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "13px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    marginBottom: "16px",
  },
  modalActions: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
  },
  saveBtn: {
    padding: "8px 16px",
    background: "#3b82f6",
    color: "#ffffff",
    borderRadius: "6px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "6px",
    fontWeight: 600,
    border: "1px solid #cbd5e1",
    cursor: "pointer",
  },
};
