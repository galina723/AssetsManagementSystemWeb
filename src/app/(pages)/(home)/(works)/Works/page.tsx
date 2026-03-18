"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaTrash,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaTasks,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

export default function WorkPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
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

  // Helpers
  const findAssetName = (id: any) =>
    assets.find((a) => a.assetID === id)?.name || "Unknown Asset";
  const findCreatorName = (userId: any) =>
    accounts.find((acc) => acc.userID === userId)?.fullName || "Unknown User";

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

  // Pagination Calculations
  const totalPages = Math.ceil(works.length / ITEMS_PER_PAGE);
  const currentWorks = works.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading)
    return <div style={pastelStyles.loadingContainer}>Loading works...</div>;

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
        <div>
          <h1 style={pastelStyles.title}>Work Management</h1>
        </div>
        <button
          onClick={() => router.push("/CreateWork")}
          style={pastelStyles.addBtn}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> Add New Work
        </button>
      </div>

      <div style={pastelStyles.card}>
        <div style={pastelStyles.tableWrapper}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.thSmall}>#</th>
                <th style={pastelStyles.th}>Work Name</th>
                <th style={pastelStyles.th}>Target Asset</th>
                <th style={pastelStyles.th}>Due Date</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentWorks.map((item, index) => {
                const seq = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                return (
                  <tr key={item.workID} className="table-row-style">
                    <td
                      style={{
                        ...pastelStyles.td,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      {seq}
                    </td>
                    <td style={{ ...pastelStyles.td, fontWeight: 600 }}>
                      {item.name}
                    </td>
                    <td style={pastelStyles.td}>
                      {findAssetName(item.assetID)}
                    </td>
                    <td style={pastelStyles.td}>
                      {item.dueDate?.slice(0, 10)}
                    </td>
                    <td style={pastelStyles.td}>
                      <span
                        className={`status-tag ${item.status?.toLowerCase().replace(" ", "-")}`}
                      >
                        {item.status || "N/A"}
                      </span>
                    </td>
                    <td
                      style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}
                    >
                      <button
                        title="View detail"
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
                        title="Delete work"
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={pastelStyles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={pastelStyles.pageBtn}
            >
              <FaChevronLeft />
            </button>
            <div style={{ display: "flex", gap: 5 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    ...pastelStyles.pageBtn,
                    backgroundColor:
                      currentPage === i + 1 ? mainPastelColor : "#fff",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={pastelStyles.pageBtn}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* VIEW DETAIL MODAL */}
      {openDetailModal && viewingWork && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div style={pastelStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Work Details</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <div style={pastelStyles.detailItem}>
                <strong>Name:</strong> {viewingWork.name}
              </div>
              <div style={pastelStyles.detailItem}>
                <strong>Asset:</strong> {findAssetName(viewingWork.assetID)}
              </div>
              <div style={pastelStyles.detailItem}>
                <strong>Creator:</strong>{" "}
                {findCreatorName(viewingWork.createdBy)}
              </div>
              <div style={pastelStyles.detailItem}>
                <strong>Due Date:</strong>{" "}
                {new Date(viewingWork.dueDate).toLocaleDateString()}
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
                {viewingWork.description || "No description provided."}
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

      {/* DELETE CONFIRM MODAL */}
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
              <h3>Delete Work?</h3>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                This task will be permanently removed.
              </p>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...pastelStyles.saveBtn,
                  backgroundColor: deletePastelColor,
                  color: "#610000",
                }}
                onClick={handleDelete}
              >
                Delete
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
        .status-tag.new {
          background: #e0e7ff;
          color: #4338ca;
        }
        .status-tag.completed {
          background: #dcfce7;
          color: #15803d;
        }
        .status-tag.in-progress {
          background: #fef3c7;
          color: #92400e;
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
  subtitle: { fontSize: "14px", color: "#8e9aaf", margin: 0 },
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
  pagination: {
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer",
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
    maxWidth: "500px",
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
  detailItem: { marginBottom: "12px", fontSize: "14px", color: "#334155" },
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
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: mainPastelTextColor,
    fontWeight: "700",
  },
};
