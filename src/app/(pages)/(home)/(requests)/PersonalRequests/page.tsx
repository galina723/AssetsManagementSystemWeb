"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaBox,
  FaWarehouse,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaUserCircle,
} from "react-icons/fa";

const mainPastelColor = "#3b82f6";
const RequestTypeConfig: Record<number, string> = {
  0: "Broken",
  1: "Recall",
  2: "Lost",
  3: "Report",
  4: "Move Warehouse",
  5: "Wh. Delete",
};

type ModalType =
  | "none"
  | "view"
  | "selectType"
  | "addPersonalAsset"
  | "addWarehouseAsset"
  | "addWhLocation"
  | "addWhDelete"
  | "editAsset"
  | "editWarehouse"
  | "confirmDelete";

export default function MyRequestsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [myWarehouses, setMyWarehouses] = useState<any[]>([]);
  const [myAssets, setMyAssets] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [modalType, setModalType] = useState<ModalType>("none");
  const [viewingReport, setViewingReport] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    id: 0,
    type: 0,
    assetID: "",
    description: "",
    warehouseID: "",
    newLatitude: "",
    newLongitude: "",
    reason: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const BASE_URL = "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInitialData = async () => {
    if (!token) return;
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      };
      const [resReports, resAssets, resWH] = await Promise.allSettled([
        axios.get(`${BASE_URL}/requestreport/created-list-request`, {
          headers,
        }),
        axios.get(`${BASE_URL}/Asset/my-assets`, { headers }),
        axios.get(`${BASE_URL}/Warehouse/dropdown-warehouse`, { headers }),
      ]);
      if (resReports.status === "fulfilled")
        setReports(resReports.value.data.data || []);
      if (resAssets.status === "fulfilled")
        setMyAssets(resAssets.value.data.data || []);
      if (resWH.status === "fulfilled")
        setMyWarehouses(resWH.value.data.data || []);
    } catch (err) {
      showToast("Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenView = async (id: number) => {
    setModalType("view");
    setDetailLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/requestreport/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setViewingReport(res.data.data);
    } catch (err) {
      showToast("Could not load details", "error");
      setModalType("none");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      let url = "";
      let payload: any = {};
      const isEdit = modalType.includes("edit");
      const method = isEdit ? "put" : "post";

      if (modalType.includes("Asset") || (isEdit && formData.type <= 3)) {
        url = isEdit
          ? `${BASE_URL}/requestreport/update/${formData.id}`
          : modalType === "addPersonalAsset"
            ? `${BASE_URL}/requestreport/request-asset`
            : `${BASE_URL}/requestreport/request-asset-warehouse`;
        payload = {
          assetID: Number(formData.assetID),
          type: Number(formData.type),
          description: formData.description,
        };
      } else if (
        modalType === "addWhLocation" ||
        (isEdit && formData.type === 4)
      ) {
        url = isEdit
          ? `${BASE_URL}/RequestReport/update-location/${formData.id}`
          : `${BASE_URL}/RequestReport/request-location`;
        payload = {
          warehouseID: Number(formData.warehouseID),
          newLatitude: Number(formData.newLatitude),
          newLongitude: Number(formData.newLongitude),
          reason: formData.reason,
        };
      } else if (
        modalType === "addWhDelete" ||
        (isEdit && formData.type === 5)
      ) {
        url = isEdit
          ? `${BASE_URL}/requestreport/update-delete/${formData.id}`
          : `${BASE_URL}/RequestReport/request-delete`;
        payload = {
          warehouseID: Number(formData.warehouseID),
          reason: formData.reason,
        };
      }

      await axios({ method, url, data: payload, headers });
      showToast("Success!");
      closeModal();
      fetchInitialData();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Action failed!", "error");
    }
  };

  const closeModal = () => {
    setModalType("none");
    setViewingReport(null);
    setFormData({
      id: 0,
      type: 0,
      assetID: "",
      description: "",
      warehouseID: "",
      newLatitude: "",
      newLongitude: "",
      reason: "",
    });
  };

  const renderStatus = (s: number) => {
    const map: any = {
      0: { t: "Pending", b: "#fef3c7", c: "#b45309" },
      1: { t: "Accepted", b: "#dcfce7", c: "#15803d" },
      2: { t: "Rejected", b: "#fee2e2", c: "#b91c1c" },
    };
    const m = map[s] || { t: "Unknown", b: "#eee", c: "#333" };
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "16px",
          background: m.b,
          color: m.c,
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {m.t}
      </span>
    );
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const currentReports = reports.slice(
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
        <h1 style={pastelStyles.title}>My Requests</h1>
        <button
          style={pastelStyles.addBtn}
          onClick={() => setModalType("selectType")}
        >
          <FaPlus size={12} style={{ marginRight: 8 }} /> New Request
        </button>
      </div>

      <div style={pastelStyles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.th}>#</th>
                <th style={pastelStyles.th}>Type</th>
                <th style={pastelStyles.th}>Content</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((r, i) => (
                <tr key={r.id || i} className="table-row-style">
                  <td style={pastelStyles.td}>
                    {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td style={pastelStyles.td}>
                    <span style={pastelStyles.typeBadge}>
                      {RequestTypeConfig[r.type]}
                    </span>
                  </td>
                  <td style={pastelStyles.td}>{r.description || r.reason}</td>
                  <td style={pastelStyles.td}>
                    {renderStatus(r.currentStatus ?? r.status)}
                  </td>
                  <td style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}>
                    <button
                      style={{
                        ...pastelStyles.iconBtn,
                        ...pastelStyles.viewBtn,
                      }}
                      onClick={() => handleOpenView(r.id)}
                    >
                      <FaEye />
                    </button>
                    {(r.currentStatus === 0 || r.status === 0) && (
                      <>
                        <button
                          style={{
                            ...pastelStyles.iconBtn,
                            ...pastelStyles.editBtn,
                          }}
                          onClick={() => {
                            setFormData({
                              id: r.id,
                              type: r.type,
                              assetID: r.assetID || "",
                              description: r.description || "",
                              warehouseID: r.warehouseID || "",
                              newLatitude: r.newLatitude || "",
                              newLongitude: r.newLongitude || "",
                              reason: r.reason || r.description || "",
                            });
                            setModalType(
                              r.type <= 3 ? "editAsset" : "editWarehouse",
                            );
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={{
                            ...pastelStyles.iconBtn,
                            ...pastelStyles.deleteBtn,
                          }}
                          onClick={() => {
                            setDeleteTarget(r.id);
                            setModalType("confirmDelete");
                          }}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={pastelStyles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={
                currentPage === 1
                  ? pastelStyles.pageBtnDisabled
                  : pastelStyles.pageBtn
              }
            >
              <FaChevronLeft size={10} />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                style={{
                  ...pastelStyles.pageBtn,
                  backgroundColor:
                    currentPage === idx + 1 ? mainPastelColor : "white",
                  color: currentPage === idx + 1 ? "white" : "#64748b",
                }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={
                currentPage === totalPages
                  ? pastelStyles.pageBtnDisabled
                  : pastelStyles.pageBtn
              }
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        )}
      </div>

      {/* MODAL VIEW DETAIL */}
      {modalType === "view" && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "650px", width: "95%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Request Detail</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              {detailLoading ? (
                <p>Loading...</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    {viewingReport?.asset ? (
                      <>
                        <h4 style={secTitle}>
                          <FaBox /> Asset Info
                        </h4>
                        <p style={valStyle}>
                          <b>Name:</b> {viewingReport.asset.name}
                        </p>
                        <p style={valStyle}>
                          <b>Code:</b> {viewingReport.asset.code}
                        </p>
                      </>
                    ) : viewingReport?.warehouse ? (
                      <>
                        <h4 style={secTitle}>
                          <FaWarehouse /> Warehouse Info
                        </h4>
                        <p style={valStyle}>
                          <b>Name:</b> {viewingReport.warehouse.name}
                        </p>
                        <p style={valStyle}>
                          <b>Current Lat:</b> {viewingReport.warehouse.latitude}
                        </p>
                        <p style={valStyle}>
                          <b>Current Long:</b>{" "}
                          {viewingReport.warehouse.longitude}
                        </p>
                      </>
                    ) : null}
                  </div>
                  <div>
                    <h4 style={secTitle}>
                      <FaUserCircle /> Requester
                    </h4>
                    <p style={valStyle}>
                      <b>Name:</b> {viewingReport?.creator?.fullName}
                    </p>
                    <p style={valStyle}>
                      <b>Type:</b> {RequestTypeConfig[viewingReport?.type]}
                    </p>
                  </div>
                  <div
                    style={{
                      gridColumn: "span 2",
                      background: "#f8fafc",
                      padding: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      CONTENT / REASON
                    </p>
                    <p style={{ fontStyle: "italic", margin: 0 }}>
                      {viewingReport?.description || viewingReport?.reason}
                    </p>
                    {viewingReport?.newLatitude && (
                      <div
                        style={{
                          marginTop: "10px",
                          paddingTop: "10px",
                          borderTop: "1px solid #e2e8f0",
                        }}
                      >
                        <p style={{ fontSize: "12px" }}>
                          <b>Requested Coordinates:</b>{" "}
                          {viewingReport.newLatitude},{" "}
                          {viewingReport.newLongitude}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={pastelStyles.modalActions}>
              <button style={pastelStyles.saveBtn} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SELECT TYPE */}
      {modalType === "selectType" && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "400px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Select Request Type</h2>
            </div>
            <div style={{ padding: "20px", display: "grid", gap: "10px" }}>
              <button
                className="select-item"
                onClick={() => {
                  setFormData({ ...formData, type: 0 });
                  setModalType("addPersonalAsset");
                }}
              >
                <FaBox color="#3b82f6" /> Personal Asset Request
              </button>
              <button
                className="select-item"
                onClick={() => {
                  setFormData({ ...formData, type: 0 });
                  setModalType("addWarehouseAsset");
                }}
              >
                <FaWarehouse color="#10b981" /> Warehouse Item Request
              </button>
              <button
                className="select-item"
                onClick={() => {
                  setFormData({ ...formData, type: 4 });
                  setModalType("addWhLocation");
                }}
              >
                <FaMapMarkerAlt color="#f59e0b" /> Move Warehouse Location
              </button>
              <button
                className="select-item"
                onClick={() => {
                  setFormData({ ...formData, type: 5 });
                  setModalType("addWhDelete");
                }}
              >
                <FaExclamationTriangle color="#ef4444" /> Request Delete
                Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSET FORM */}
      {(modalType.includes("Asset") || modalType === "editAsset") && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "500px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Asset Request</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              <label style={pastelStyles.label}>Select Asset</label>
              <select
                style={pastelStyles.select}
                value={formData.assetID}
                onChange={(e) =>
                  setFormData({ ...formData, assetID: e.target.value })
                }
              >
                <option value="">-- Choose Asset --</option>
                {myAssets.map((a, idx) => (
                  <option key={idx} value={a.id || a.assetID}>
                    {a.name}
                  </option>
                ))}
              </select>
              <label style={pastelStyles.label}>Issue Type</label>
              <select
                style={pastelStyles.select}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: Number(e.target.value) })
                }
              >
                <option value={0}>Broken</option>
                <option value={1}>Recall</option>
                <option value={2}>Lost</option>
                <option value={3}>Report</option>
              </select>
              <label style={pastelStyles.label}>Description</label>
              <textarea
                style={pastelStyles.textarea}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div style={pastelStyles.modalActions}>
              <button style={pastelStyles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button style={pastelStyles.saveBtn} onClick={handleFinalSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WAREHOUSE FORM */}
      {(modalType.includes("Wh") || modalType === "editWarehouse") &&
        !modalType.includes("Asset") && (
          <div style={pastelStyles.modalOverlay} onClick={closeModal}>
            <div
              style={{ ...pastelStyles.modal, maxWidth: "500px", width: "90%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={pastelStyles.modalHeader}>
                <h2 style={pastelStyles.modalTitle}>
                  {formData.type === 4 ? "Move Location" : "Delete Request"}
                </h2>
              </div>
              <div style={pastelStyles.modalBody}>
                <label style={pastelStyles.label}>Select Warehouse</label>
                <select
                  style={pastelStyles.select}
                  value={formData.warehouseID}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseID: e.target.value })
                  }
                >
                  <option value="">-- Choose Warehouse --</option>
                  {myWarehouses.map((w, idx) => (
                    <option key={idx} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
                {Number(formData.type) === 4 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label style={pastelStyles.label}>New Lat</label>
                      <input
                        style={pastelStyles.select}
                        type="number"
                        value={formData.newLatitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newLatitude: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={pastelStyles.label}>New Long</label>
                      <input
                        style={pastelStyles.select}
                        type="number"
                        value={formData.newLongitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newLongitude: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <label style={pastelStyles.label}>Reason</label>
                <textarea
                  style={pastelStyles.textarea}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                />
              </div>
              <div style={pastelStyles.modalActions}>
                <button style={pastelStyles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button
                  style={pastelStyles.saveBtn}
                  onClick={handleFinalSubmit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      {/* DELETE CONFIRM */}
      {modalType === "confirmDelete" && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{
              ...pastelStyles.modal,
              maxWidth: 320,
              padding: 30,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaExclamationCircle
              size={40}
              color="#ef4444"
              style={{ marginBottom: 15 }}
            />
            <h3>Delete this request?</h3>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <button style={pastelStyles.cancelBtn} onClick={closeModal}>
                No
              </button>
              <button
                style={{ ...pastelStyles.saveBtn, backgroundColor: "#ef4444" }}
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${BASE_URL}/requestreport/${deleteTarget}`,
                      { headers: { Authorization: `Bearer ${token}` } },
                    );
                    showToast("Deleted successfully!");
                    closeModal();
                    fetchInitialData();
                  } catch {
                    showToast("Delete failed", "error");
                  }
                }}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .table-row-style:hover {
          background-color: #f8fafc;
        }
        .select-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: 0.2s;
          font-weight: 600;
          width: 100%;
          text-align: left;
        }
        .select-item:hover {
          background: #f1f5f9;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

const secTitle: any = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#3b82f6",
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 10,
};
const valStyle: any = { margin: "0 0 5px 0", fontSize: "13px" };
const pastelStyles: any = {
  container: {
    padding: "24px",
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
  title: { fontSize: "22px", fontWeight: "bold", color: "#1e293b" },
  addBtn: {
    background: mainPastelColor,
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
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
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: { background: "#e0f2fe", color: "#0284c7" },
  editBtn: { background: "#ffedd5", color: "#c2410c" },
  deleteBtn: { background: "#fee2e2", color: "#ef4444" },
  typeBadge: {
    background: "#e0e7ff",
    color: "#4338ca",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  pagination: {
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    borderTop: "1px solid #f1f5f9",
  },
  pageBtn: {
    minWidth: "30px",
    height: "30px",
    border: "1px solid #e2e8f0",
    background: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#64748b",
  },
  pageBtnDisabled: {
    minWidth: "30px",
    height: "30px",
    border: "1px solid #f1f5f9",
    background: "#f8fafc",
    borderRadius: "6px",
    cursor: "not-allowed",
    color: "#cbd5e1",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  modalTitle: { margin: 0, fontSize: "16px", fontWeight: 700 },
  modalBody: { padding: "20px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#475569",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    resize: "none",
  },
  modalActions: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#f8fafc",
  },
  saveBtn: {
    background: mainPastelColor,
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    background: "white",
    border: "1px solid #cbd5e1",
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#64748b",
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
  },
};
