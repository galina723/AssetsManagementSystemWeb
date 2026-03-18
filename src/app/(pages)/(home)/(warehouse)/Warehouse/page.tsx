"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addSidebar } from "@/redux/reducers/sidebarReducer";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaWarehouse,
  FaMapMarkedAlt,
} from "react-icons/fa";

interface Warehouse {
  warehouseID: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  assets?: any[] | null;
  managers?: any[] | null;
}

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

export default function WarehousePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
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
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(
    null,
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const BASE_URL = "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setWarehouses(res.data.data || []);
    } catch (e) {
      showToast("Failed to fetch warehouses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(addSidebar("warehouse"));
    fetchWarehouses();
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`${BASE_URL}/warehouse/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Warehouse deleted successfully");
      setOpenDeleteModal(false);
      fetchWarehouses();
    } catch (e) {
      showToast("Delete failed", "error");
    }
  };

  // Pagination Calculations
  const totalPages = Math.ceil(warehouses.length / ITEMS_PER_PAGE);
  const currentWarehouses = warehouses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading)
    return (
      <div style={pastelStyles.loadingContainer}>Loading warehouses...</div>
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

      {/* HEADER */}
      <div style={pastelStyles.header}>
        <div>
          <h1 style={pastelStyles.title}>Warehouse List</h1>
        </div>
        <button
          onClick={() => router.push("CreateWarehouse")}
          style={pastelStyles.addBtn}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> Add New Warehouse
        </button>
      </div>

      {/* DATA TABLE */}
      <div style={pastelStyles.card}>
        <div style={pastelStyles.tableWrapper}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.thSmall}>#</th>
                <th style={pastelStyles.th}>Warehouse Name</th>
                <th style={pastelStyles.th}>Address</th>
                <th style={pastelStyles.th}>Lat / Long</th>
                <th style={pastelStyles.th}>Description</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentWarehouses.map((w, index) => {
                const seq = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                return (
                  <tr key={w.warehouseID} className="table-row-style">
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
                      {w.name}
                    </td>
                    <td style={pastelStyles.td}>{w.address}</td>
                    <td style={pastelStyles.td}>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        <FaMapMarkedAlt size={10} style={{ marginRight: 4 }} />
                        {w.latitude} , {w.longitude}
                      </div>
                    </td>
                    <td style={pastelStyles.td}>
                      <div style={pastelStyles.truncate}>
                        {w.description || "N/A"}
                      </div>
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
                          setViewingWarehouse(w);
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
                          router.push(`/EditWarehouse?id=${w.warehouseID}`)
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
                          setSelectedId(w.warehouseID);
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

      {/* VIEW DETAIL MODAL */}
      {openDetailModal && viewingWarehouse && (
        <div
          style={pastelStyles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div style={pastelStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Warehouse Details</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <div style={pastelStyles.detailGrid}>
                <div style={pastelStyles.detailItem}>
                  <strong>Name:</strong> {viewingWarehouse.name}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Latitude:</strong> {viewingWarehouse.latitude}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Longitude:</strong> {viewingWarehouse.longitude}
                </div>
                <div style={pastelStyles.detailItem}>
                  <strong>Managers:</strong>{" "}
                  {viewingWarehouse.managers?.length || 0} assigned
                </div>
              </div>
              <div style={{ ...pastelStyles.detailItem, marginTop: 15 }}>
                <strong>Full Address:</strong>
                <br />
                {viewingWarehouse.address}
              </div>
              <div
                style={{
                  ...pastelStyles.detailItem,
                  marginTop: 15,
                  padding: 12,
                  background: "#f8faff",
                  borderRadius: 8,
                }}
              >
                <strong>Description:</strong>
                <br />
                {viewingWarehouse.description || "No description provided."}
              </div>
            </div>
            <div style={pastelStyles.modalActions}>
              <button
                style={pastelStyles.cancelBtn}
                onClick={() => setOpenDetailModal(false)}
              >
                Close Information
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
              <h3>Delete Warehouse?</h3>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                All records for this facility will be removed.
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
                Confirm Delete
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
  truncate: {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    maxWidth: "550px",
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
