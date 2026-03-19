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
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

// Mapping enum từ Backend - Đồng bộ với C# Enum
const WorkStatusConfig: Record<number, { label: string; class: string }> = {
  0: { label: "New", class: "status-new" },
  1: { label: "In Progress", class: "status-inprogress" },
  2: { label: "Completed", class: "status-completed" },
  3: { label: "Cancelled", class: "status-cancelled" },
};

export default function WorkPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [workToDeleteId, setWorkToDeleteId] = useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewingWork, setViewingWork] = useState<any>(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    workID: 0,
    assetID: 0,
    name: "",
    dueDate: "",
    description: "",
    status: 0,
    assignedUserID: 0,
  });

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
      const [resWorks, resAssets, resAccs] = await Promise.all([
        axios.get(`${BASE_URL}/work/get-work-createdList`, { headers }),
        axios.get(`${BASE_URL}/asset`, { headers }),
        axios.get(`${BASE_URL}/account`, { headers }),
      ]);
      setWorks(resWorks.data?.data || []);
      setAssets(resAssets.data?.data || []);
      setAccounts(resAccs.data?.data || []);
    } catch (e) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findAssetName = (id: any) =>
    assets.find((a) => a.assetID === id)?.name || "Unknown Asset";

  const openEdit = (item: any) => {
    let currentStatus = 0;
    if (typeof item.status === "number") {
      currentStatus = item.status;
    } else {
      const statusEntry = Object.entries(WorkStatusConfig).find(
        ([_, v]) => v.label === item.status,
      );
      currentStatus = statusEntry ? Number(statusEntry[0]) : 0;
    }

    setEditFormData({
      workID: item.workID,
      assetID: item.assetID,
      name: item.name,
      dueDate: item.dueDate ? item.dueDate.slice(0, 16) : "",
      description: item.description || "",
      status: currentStatus,
      assignedUserID: item.assignedUserID || 0,
    });
    setOpenEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = { ...editFormData, status: Number(editFormData.status) };
      await axios.put(`${BASE_URL}/Work/${editFormData.workID}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      showToast("Work updated!");
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
      showToast("Deleted!");
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
        <h1 style={pastelStyles.title}>Work Management</h1>
        <button
          onClick={() => router.push("/CreateWork")}
          style={pastelStyles.addBtn}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> Add Work
        </button>
      </div>

      <div style={pastelStyles.card}>
        <table style={pastelStyles.table}>
          <thead>
            <tr>
              <th style={pastelStyles.thSmall}>#</th>
              <th style={pastelStyles.th}>Work Name</th>
              <th style={pastelStyles.th}>Asset</th>
              <th style={pastelStyles.th}>Status</th>
              <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentWorks.map((item, index) => {
              const statusKey =
                typeof item.status === "number"
                  ? item.status
                  : Object.keys(WorkStatusConfig).find(
                      (k) => WorkStatusConfig[Number(k)].label === item.status,
                    ) || 0;
              const statusInfo = WorkStatusConfig[Number(statusKey)];

              return (
                <tr key={item.workID} className="table-row-style">
                  <td
                    style={{
                      ...pastelStyles.td,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td style={{ ...pastelStyles.td, fontWeight: 600 }}>
                    {item.name}
                  </td>
                  <td style={pastelStyles.td}>{findAssetName(item.assetID)}</td>
                  <td style={pastelStyles.td}>
                    <span className={`status-tag ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}>
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

      {/* DETAIL MODAL - NHỎ XINH GỌN GÀNG */}
      {openDetailModal && viewingWork && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div
            style={{ ...pastelStyles.modal, maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ ...pastelStyles.modalHeader, padding: "15px 20px" }}>
              <h2 style={{ ...pastelStyles.modalTitle, fontSize: "16px" }}>
                <FaInfoCircle style={{ marginRight: 8 }} /> Detail
              </h2>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={pastelStyles.detailRow}>
                <span>Task:</span>
                <strong>{viewingWork.name}</strong>
              </div>
              <div style={pastelStyles.detailRow}>
                <span>Asset:</span>
                <strong>{findAssetName(viewingWork.assetID)}</strong>
              </div>
              <div style={pastelStyles.detailRow}>
                <span>Date:</span>
                <strong>{viewingWork.dueDate?.slice(0, 10)}</strong>
              </div>
              <div style={{ marginTop: "10px" }}>
                <span style={pastelStyles.label}>Description:</span>
                <div style={pastelStyles.descriptionBox}>
                  {viewingWork.description || "No description."}
                </div>
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

      {/* EDIT MODAL - GỌN GÀNG */}
      {openEditModal && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenEditModal(false)}
        >
          <div
            style={{ ...pastelStyles.modal, maxWidth: 450 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Update Status</h2>
            </div>
            <div style={{ padding: "20px" }}>
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
                {Object.entries(WorkStatusConfig).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL GIỮ NGUYÊN... */}

      <style jsx global>{`
        .table-row-style:hover {
          background-color: #f8faff;
        }
        .status-tag {
          padding: 4px 10px;
          border-radius: 12px;
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
    fontFamily: "sans-serif",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "white",
    zIndex: 9999,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "24px", fontWeight: "800", color: mainPastelTextColor },
  addBtn: {
    background: mainPastelColor,
    color: mainPastelTextColor,
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    border: "1px solid #e0e7f2",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "15px",
    background: "#f8faff",
    color: "#5c677d",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  thSmall: { textAlign: "center", padding: "15px", width: "50px" },
  td: {
    padding: "14px 15px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#475569",
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
    background: "rgba(15, 23, 42, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "white",
    width: "90%",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8faff",
  },
  modalTitle: { margin: 0, fontWeight: "700", color: mainPastelTextColor },
  modalActions: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#f8faff",
  },
  saveBtn: {
    border: "none",
    padding: "8px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  cancelBtn: {
    background: "white",
    border: "1px solid #cbd5e1",
    padding: "8px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#64748b",
    fontWeight: "600",
  },
  label: {
    display: "block",
    marginBottom: "6px",
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
    outline: "none",
    fontSize: "14px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px dashed #e2e8f0",
    fontSize: "14px",
  },
  descriptionBox: {
    background: "#f8faff",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#475569",
    marginTop: "5px",
    border: "1px solid #edf2f7",
  },
};
