"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaCube,
  FaTag,
  FaMapMarkerAlt,
  FaUserPlus, // Thêm icon mới
} from "react-icons/fa";

// Interface logic
interface AssetModel {
  assetID: number;
  warehouseID: number;
  name: string;
  code: string;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  unit: string;
  currency: string;
  note: string;
  status: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  totalQuantity: number;
  availableQuantity: number;
  latitude: number;
  longitude: number;
  isInWarehouse: boolean;
}

// Interface User mới
interface UserModel {
  userID: number;
  fullName: string;
}

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";
const assignPastelColor = "#caffbf"; // Màu mới cho assign

export default function AssetsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & UI States
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<AssetModel | null>(null);

  // States mới cho Assign
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [assignData, setAssignData] = useState({
    userID: 0,
    unit: 1,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const BASE_URL = "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/asset`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setAssets(res.data.data || []);
    } catch (err) {
      showToast("Failed to load assets", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users cho dropdown
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Account`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`${BASE_URL}/asset/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Asset deleted successfully");
      setOpenDeleteModal(false);
      fetchAssets();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  // Hàm handle Assign
  const handleAssign = async () => {
    if (assignData.userID === 0) {
      showToast("Please select a user", "error");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/Asset/assign`,
        {
          assetID: selectedId,
          userID: assignData.userID,
          unit: assignData.unit,
          assignedDate: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showToast("Assigned successfully");
      setOpenAssignModal(false);
      fetchAssets();
    } catch (err) {
      showToast("Assign failed", "error");
    }
  };

  // Pagination Calculations
  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const currentAssets = assets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "available" || s === "active")
      return { bg: "#dcfce7", color: "#15803d" };
    if (s === "broken" || s === "retired")
      return { bg: "#fee2e2", color: "#b91c1c" };
    return { bg: "#fef3c7", color: "#b45309" };
  };

  if (loading)
    return <div style={pastelStyles.loadingContainer}>Loading assets...</div>;

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
          <h1 style={pastelStyles.title}>Asset Management</h1>
        </div>
        <button
          onClick={() => router.push("CreateAssets")}
          style={pastelStyles.addBtn}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> Add New Asset
        </button>
      </div>

      <div style={pastelStyles.card}>
        <div style={pastelStyles.tableWrapper}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.thSmall}>#</th>
                <th style={pastelStyles.th}>Asset Name</th>
                <th style={pastelStyles.th}>Code</th>
                <th style={pastelStyles.th}>Position</th>
                <th style={pastelStyles.th}>Price</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAssets.map((item, index) => {
                const seq = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                const statusStyle = getStatusStyle(item.status);
                return (
                  <tr key={item.assetID} className="table-row-style">
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
                      <code style={pastelStyles.codeLabel}>{item.code}</code>
                    </td>
                    <td style={pastelStyles.td}>{item.position || "N/A"}</td>
                    <td style={pastelStyles.td}>
                      {item.price?.toLocaleString()}{" "}
                      <small>{item.currency}</small>
                    </td>
                    <td style={pastelStyles.td}>
                      <span
                        style={{
                          ...pastelStyles.statusTag,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td
                      style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}
                    >
                      {/* Nút Assign mới */}
                      <button
                        title="Assign"
                        style={{
                          ...pastelStyles.iconBtn,
                          background: assignPastelColor,
                          color: "#2d6a4f",
                        }}
                        onClick={() => {
                          setSelectedId(item.assetID);
                          setOpenAssignModal(true);
                        }}
                      >
                        <FaUserPlus size={14} />
                      </button>

                      <button
                        title="View"
                        style={{
                          ...pastelStyles.iconBtn,
                          background: "#e0f2fe",
                          color: "#0284c7",
                        }}
                        onClick={() => {
                          setViewingAsset(item);
                          setOpenDetailModal(true);
                        }}
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        title="Edit"
                        style={{
                          ...pastelStyles.iconBtn,
                          background: "#fef3c7",
                          color: "#b45309",
                        }}
                        onClick={() =>
                          router.push(`/EditAssets?id=${item.assetID}`)
                        }
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        title="Delete"
                        style={{
                          ...pastelStyles.iconBtn,
                          background: deletePastelColor,
                          color: "#610000",
                        }}
                        onClick={() => {
                          setSelectedId(item.assetID);
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
              <FaChevronLeft size={10} />
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
              <FaChevronRight size={10} />
            </button>
          </div>
        )}
      </div>

      {/* ASSIGN MODAL */}
      {openAssignModal && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenAssignModal(false)}
        >
          <div
            style={{ ...pastelStyles.modal, maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Assign Asset</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Select User
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "5px",
                  }}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      userID: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Select User</option>
                  {users.map((u) => (
                    <option key={u.userID} value={u.userID}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Units
                </label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "5px",
                  }}
                  value={assignData.unit}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      unit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenAssignModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...pastelStyles.saveBtn,
                  backgroundColor: assignPastelColor,
                  color: "#2d6a4f",
                }}
                onClick={handleAssign}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {openDetailModal && viewingAsset && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div style={pastelStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Asset Specifications</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <div style={pastelStyles.detailGrid}>
                <div style={pastelStyles.detailItem}>
                  <strong>Name:</strong> {viewingAsset.name}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Code:</strong> {viewingAsset.code}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Owner:</strong> {viewingAsset.owner}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Price:</strong> {viewingAsset.price}{" "}
                  {viewingAsset.currency}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Available:</strong> {viewingAsset.availableQuantity} /{" "}
                  {viewingAsset.totalQuantity}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Purchase Date:</strong>{" "}
                  {new Date(viewingAsset.dateOfPurchase).toLocaleDateString()}
                </div>
              </div>
              <div
                style={{
                  ...pastelStyles.detailItem,
                  marginTop: 15,
                  padding: 10,
                  background: "#f8faff",
                  borderRadius: 8,
                }}
              >
                <strong>Note:</strong>
                <br />
                {viewingAsset.note || "No specific notes."}
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
              <h3>Delete Asset?</h3>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                This action is permanent and cannot be undone.
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
    animation: "fadeIn 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: mainPastelTextColor,
    margin: 0,
  },
  subtitle: { fontSize: "14px", color: "#8e9aaf", margin: "4px 0 0 0" },
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
    verticalAlign: "middle",
  },
  codeLabel: {
    background: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#475569",
  },
  statusTag: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
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
    gap: "15px",
    borderTop: "1px solid #f1f5f9",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
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
    maxWidth: "600px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8faff",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    color: mainPastelTextColor,
    fontWeight: "800",
  },
  modalBody: { padding: "24px" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  detailItem: { fontSize: "14px", color: "#334155" },
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
