"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa";

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

// Cấu hình Status dựa trên chuỗi trả về từ API
const WorkStatusConfig: Record<
  string,
  { label: string; class: string; value: number }
> = {
  New: { label: "New", class: "status-new", value: 0 },
  "In Progress": { label: "In Progress", class: "status-inprogress", value: 1 },
  Completed: { label: "Completed", class: "status-completed", value: 2 },
  Cancelled: { label: "Cancelled", class: "status-cancelled", value: 3 },
};

export default function WorkPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [workToDeleteId, setWorkToDeleteId] = useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewingWork, setViewingWork] = useState<any>(null);

  // Edit States
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    workID: 0,
    assetID: 0, // Giữ ngầm để gửi api put không bị lỗi
    name: "",
    dueDate: "",
    description: "",
    status: 0,
    assignedUserID: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const BASE_URL = "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    };

    try {
      // 1. Lấy danh sách Work
      const resWorks = await axios.get(
        `${BASE_URL}/work/get-assigned-worklist`,
        { headers },
      );
      setWorks(resWorks.data?.data || []);

      // 2. Lấy list Account
      try {
        const resAccs = await axios.get(`${BASE_URL}/account`, { headers });
        setAccounts(resAccs.data?.data || []);
      } catch (e) {
        setAccounts([]);
      }
    } catch (e) {
      showToast("Failed to load work list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Actions
  const openEdit = (item: any) => {
    const statusValue = WorkStatusConfig[item.status]?.value || 0;

    setEditFormData({
      workID: item.workID,
      assetID: item.assetID, // Bắn ngầm lại ID cũ
      name: item.name,
      dueDate: item.dueDate ? item.dueDate.slice(0, 16) : "",
      description: item.description || "",
      status: statusValue,
      assignedUserID: item.createdBy || 0,
    });
    setOpenEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/Work/${editFormData.workID}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      showToast("Work updated successfully!");
      setOpenEditModal(false);
      fetchData();
    } catch (e) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    if (!workToDeleteId) return;
    try {
      await axios.delete(`${BASE_URL}/work/${workToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Work deleted successfully!");
      setOpenDeleteModal(false);
      fetchData();
    } catch (e) {
      showToast("Delete failed", "error");
    }
  };

  const currentWorks = works.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div style={pastelStyles.container}>
      {toast && (
        <div
          style={{
            ...pastelStyles.toast,
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div style={pastelStyles.header}>
        <h1 style={pastelStyles.title}>My Work List</h1>
      </div>

      <div style={pastelStyles.card}>
        <div style={pastelStyles.tableWrapper}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.thSmall}>#</th>
                <th style={pastelStyles.th}>Work Name</th>
                <th style={pastelStyles.th}>Due Date</th>
                <th style={pastelStyles.th}>Staff</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentWorks.map((item, index) => {
                const statusInfo =
                  WorkStatusConfig[item.status] || WorkStatusConfig["New"];

                return (
                  <tr key={item.workID} className="table-row-style">
                    <td
                      style={{
                        ...pastelStyles.td,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td style={{ ...pastelStyles.td, fontWeight: 600 }}>
                      {item.name}
                    </td>
                    <td style={pastelStyles.td}>
                      {item.dueDate?.split("T")[0]}
                    </td>
                    <td style={pastelStyles.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaUsers color="#94a3b8" />
                        {item.assignments?.length || 0}
                      </div>
                    </td>
                    <td style={pastelStyles.td}>
                      <span className={`status-tag ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td
                      style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}
                    >
                      <button
                        style={{
                          ...pastelStyles.iconBtn,
                          background: "#e0f2fe",
                          color: "#0284c7",
                        }}
                        onClick={() => {
                          setViewingWork(item);
                          setOpenDetailModal(true);
                        }}
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        style={{
                          ...pastelStyles.iconBtn,
                          background: "#fef3c7",
                          color: "#92400e",
                        }}
                        onClick={() => openEdit(item)}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        style={{
                          ...pastelStyles.iconBtn,
                          background: deletePastelColor,
                          color: "#610000",
                        }}
                        onClick={() => {
                          setWorkToDeleteId(item.workID);
                          setOpenDeleteModal(true);
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEditModal && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenEditModal(false)}
        >
          <div
            style={{ ...pastelStyles.modal, maxWidth: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Edit Work Request</h2>
            </div>
            <div
              style={{
                ...pastelStyles.modalBody,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label style={pastelStyles.label}>Work Name</label>
                <input
                  style={pastelStyles.input}
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label style={pastelStyles.label}>Due Date</label>
                <input
                  type="datetime-local"
                  style={pastelStyles.input}
                  value={editFormData.dueDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label style={pastelStyles.label}>Status</label>
                <select
                  style={pastelStyles.input}
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: Number(e.target.value),
                    })
                  }
                >
                  {Object.entries(WorkStatusConfig).map(([key, val]) => (
                    <option key={key} value={val.value}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={pastelStyles.label}>Responsible User</label>
                <select
                  style={pastelStyles.input}
                  value={editFormData.assignedUserID}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      assignedUserID: Number(e.target.value),
                    })
                  }
                  disabled={accounts.length === 0}
                >
                  {accounts.length > 0 ? (
                    <>
                      <option value={0}>Select User</option>
                      {accounts.map((acc) => (
                        <option key={acc.userID} value={acc.userID}>
                          {acc.fullName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value={editFormData.assignedUserID}>
                      User #{editFormData.assignedUserID}
                    </option>
                  )}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={pastelStyles.label}>Description</label>
                <textarea
                  style={{ ...pastelStyles.input, minHeight: 80 }}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenEditModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...pastelStyles.saveBtn,
                  background: mainPastelColor,
                  color: mainPastelTextColor,
                }}
                onClick={handleUpdate}
              >
                Update Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {openDetailModal && viewingWork && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div style={pastelStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Work Detail View</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <div style={pastelStyles.detailItem}>
                <strong>Name:</strong> {viewingWork.name}
              </div>
              <div style={pastelStyles.detailItem}>
                <strong>Due Date:</strong>{" "}
                {new Date(viewingWork.dueDate).toLocaleString()}
              </div>
              <div style={pastelStyles.detailItem}>
                <strong>Status:</strong> {viewingWork.status}
              </div>
              <div
                style={{
                  ...pastelStyles.detailItem,
                  background: "#f8faff",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <strong>Description:</strong>
                <br />
                {viewingWork.description || "No description."}
              </div>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {openDeleteModal && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDeleteModal(false)}
        >
          <div
            style={{ ...pastelStyles.modal, maxWidth: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "30px 20px", textAlign: "center" }}>
              <FaExclamationCircle
                size={40}
                color={deletePastelColor}
                style={{ marginBottom: 15 }}
              />
              <h3>Confirm Deletion</h3>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                Remove this task from the system?
              </p>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenDeleteModal(false)}
              >
                No
              </button>
              <button
                style={{
                  ...pastelStyles.saveBtn,
                  backgroundColor: deletePastelColor,
                  color: "#610000",
                }}
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .table-row-style:hover {
          background-color: #f1f5f9;
        }
        .status-tag {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-new {
          background: #e0e7ff;
          color: #4338ca;
        }
        .status-inprogress {
          background: #fef3c7;
          color: #92400e;
        }
        .status-completed {
          background: #dcfce7;
          color: #15803d;
        }
        .status-cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

const pastelStyles: any = {
  container: {
    padding: "24px",
    background: "#fcfcfc",
    minHeight: "100vh",
    position: "relative",
    fontFamily: "sans-serif",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "28px", fontWeight: "800", color: mainPastelTextColor },
  addBtn: {
    background: mainPastelColor,
    color: mainPastelTextColor,
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    border: "1px solid #e0e7f2",
    overflow: "hidden",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "15px",
    background: "#f8faff",
    color: "#5c677d",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "2px solid #eef2ff",
  },
  thSmall: {
    textAlign: "center",
    padding: "15px",
    background: "#f8faff",
    width: "50px",
    borderBottom: "2px solid #eef2ff",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  actionCol: { display: "flex", gap: "8px", justifyContent: "center" },
  iconBtn: {
    border: "none",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "white",
    width: "90%",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8faff",
  },
  modalTitle: { margin: 0, fontSize: "18px", color: mainPastelTextColor },
  modalBody: { padding: "20px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    marginBottom: "10px",
    outline: "none",
    fontSize: "14px",
  },
  modalActions: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#f8faff",
  },
  saveBtn: {
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  cancelBtn: {
    background: "white",
    border: "1px solid #cbd5e1",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#64748b",
  },
  detailItem: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
  },
};
