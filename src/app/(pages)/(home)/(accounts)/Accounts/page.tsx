"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaUserShield,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";

const roleMap: Record<string, { name: string; bg: string; color: string }> = {
  Admin: { name: "Admin", bg: "#ffadad", color: "#610000" },
  GeneralManager: { name: "General Manager", bg: "#ffd6a5", color: "#7d4600" },
  AssetsManager: { name: "Assets Manager", bg: "#a0c4ff", color: "#003b80" },
  WarehouseManager: {
    name: "Warehouse Manager",
    bg: "#caffbf",
    color: "#1f5700",
  },
  TechnicalStaff: { name: "Technical Staff", bg: "#bdb2ff", color: "#3e008d" },
  Staff: { name: "Staff", bg: "#ffc6ff", color: "#7f007f" },
};

export default function AccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const currentUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      setOpenDelete(false);
      fetchAPI();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div style={styles.loadingContainer}>Initializing Accounts...</div>;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Account Management</h1>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => router.push("/CreateAccount")}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> Add Account
        </button>
      </div>

      {/* TABLE CARD */}
      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, textAlign: "center", width: "60px" }}
                >
                  #
                </th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Role</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u, index) => (
                <tr key={`${u.userID}-${index}`} className="table-row-style">
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "500" }}>{u.email}</td>
                  <td style={styles.td}>{u.fullName}</td>
                  <td style={styles.td}>{u.department}</td>
                  <td style={styles.td}>{renderRoleBadge(u.role)}</td>
                  <td style={{ ...styles.td, ...styles.actionCol }}>
                    <button
                      style={{ ...styles.iconBtn, ...styles.viewBtn }}
                      onClick={() => {
                        setSelectedUser(u);
                        setOpenView(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, ...styles.editBtn }}
                      onClick={() => router.push(`/EditAccount?id=${u.userID}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, ...styles.deleteBtn }}
                      onClick={() => {
                        setSelectedId(u.userID);
                        setOpenDelete(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={styles.pageBtn}
            >
              <FaChevronLeft size={12} />
            </button>
            <span style={styles.pageInfo}>
              Page <b>{currentPage}</b> of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={styles.pageBtn}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {openView && selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setOpenView(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaUserShield color="#3b82f6" />
                <h2 style={styles.modalTitle}>Account Detail</h2>
              </div>
            </div>
            <div style={styles.detailGrid}>
              <DetailItem label="Full Name" value={selectedUser.fullName} />
              <DetailItem label="Email Address" value={selectedUser.email} />
              <DetailItem
                label="Phone Number"
                value={selectedUser.phone || "N/A"}
              />
              <DetailItem label="Department" value={selectedUser.department} />

              <div
                style={{
                  gridColumn: "span 2",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: 10,
                }}
              >
                <div style={styles.detailLabel}>Assigned Role</div>
                <div style={{ marginTop: 5 }}>
                  {renderRoleBadge(selectedUser.role)}
                </div>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.saveBtn} onClick={() => setOpenView(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {openDelete && (
        <div style={styles.modalOverlay} onClick={() => setOpenDelete(false)}>
          <div
            style={{ ...styles.modal, maxWidth: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "30px 20px", textAlign: "center" }}>
              <FaInfoCircle
                size={40}
                color="#ffadad"
                style={{ marginBottom: 15 }}
              />
              <h3 style={{ margin: "0 0 10px 0" }}>Delete Account?</h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                This action cannot be undone.
              </p>
            </div>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setOpenDelete(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.saveBtn, backgroundColor: "#ffadad" }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .table-row-style:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function renderRoleBadge(role: string) {
  const info = roleMap[role] || { name: role, bg: "#f1f5f9", color: "#475569" };
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "16px",
        background: info.bg,
        color: info.color,
        fontSize: "11px",
        fontWeight: 700,
        display: "inline-block",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      {info.name}
    </span>
  );
}

const styles: any = {
  container: {
    padding: "24px 32px",
    background: "#f4f7fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "24px", fontWeight: "bold", margin: 0, color: "#1e293b" },
  subtitle: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  addBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    fontWeight: "700",
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
  },
  actionCol: { display: "flex", gap: "8px", justifyContent: "center" },
  iconBtn: {
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: { background: "#e0f2fe", color: "#0284c7" },
  editBtn: { background: "#ffedd5", color: "#c2410c" },
  deleteBtn: { background: "#fee2e2", color: "#ef4444" },
  pagination: {
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    background: "#fff",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageInfo: { fontSize: "13px", color: "#64748b" },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "white",
    width: "100%",
    maxWidth: "450px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
    fontWeight: "700",
  },
  detailGrid: {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  detailLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "4px",
  },
  modalActions: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#f8fafc",
  },
  saveBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    background: "white",
    border: "1px solid #cbd5e1",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#64748b",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748b",
    fontSize: "14px",
  },
};
