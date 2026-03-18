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
  4: "Location Change",
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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
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
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      };
      const payload = JSON.parse(atob(token.split(".")[1]));
      let role =
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role == 4 || role === "Warehouse Manager") role = "WarehouseManager";
      setUserRole(role || "User");

      const [resReports, resAssets, resWH] = await Promise.allSettled([
        axios.get(`${BASE_URL}/requestreport/created-list-request`, {
          headers,
        }),
        axios.get(`${BASE_URL}/Asset/my-assets`, { headers }),
        role === "WarehouseManager"
          ? axios.get(`${BASE_URL}/Warehouse/dropdown-warehouse`, { headers })
          : Promise.resolve(null),
      ]);

      if (resReports.status === "fulfilled")
        setReports(resReports.value.data.data || []);
      if (resAssets.status === "fulfilled")
        setMyAssets(resAssets.value.data.data || []);
      if (resWH.status === "fulfilled" && resWH.value)
        setMyWarehouses(resWH.value.data.data || []);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
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
      showToast("Could not load detail", "error");
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
      let method: "post" | "put" = modalType.includes("edit") ? "put" : "post";
      let payload: any = {};

      if (
        modalType === "editAsset" ||
        modalType === "addPersonalAsset" ||
        modalType === "addWarehouseAsset"
      ) {
        url =
          modalType === "editAsset"
            ? `${BASE_URL}/requestreport/update/${formData.id}`
            : modalType === "addPersonalAsset"
              ? `${BASE_URL}/requestreport/request-asset`
              : `${BASE_URL}/requestreport/request-asset-warehouse`;
        payload = {
          assetID: Number(formData.assetID),
          type: Number(formData.type),
          description: formData.description,
        };
      } else {
        // Nhánh Warehouse (Move/Delete)
        if (Number(formData.type) === 4) {
          // SỬ DỤNG ĐÚNG API UPDATE-LOCATION CHO TYPE 4
          url = modalType.includes("add")
            ? `${BASE_URL}/requestreport/request-location`
            : `${BASE_URL}/RequestReport/update-location/${formData.id}`;
          payload = {
            warehouseID: Number(formData.warehouseID),
            newLatitude: Number(formData.newLatitude),
            newLongitude: Number(formData.newLongitude),
            reason: formData.reason,
          };
        } else {
          url = modalType.includes("add")
            ? `${BASE_URL}/requestreport/request-delete`
            : `${BASE_URL}/requestreport/update-delete/${formData.id}`;
          payload = {
            warehouseID: Number(formData.warehouseID),
            reason: formData.reason,
          };
        }
      }

      await axios({ method, url, data: payload, headers });
      showToast("Success!");
      closeModal();
      fetchInitialData();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  const executeDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/requestreport/${deleteTarget}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Deleted!");
      closeModal();
      fetchInitialData();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const closeModal = () => {
    setModalType("none");
    setViewingReport(null);
    setDeleteTarget(null);
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
        <div style={pastelStyles.tableWrapper}>
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

        {/* PAGINATION PHẢI CÓ Ở ĐÂY */}
        {totalPages > 1 && (
          <div style={pastelStyles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={
                currentPage === 1
                  ? pastelStyles.pageBtnDisabled
                  : pastelStyles.pageBtn
              }
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
                    color: currentPage === i + 1 ? "#fff" : "#64748b",
                    borderColor:
                      currentPage === i + 1 ? mainPastelColor : "#e2e8f0",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
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

      {/* MODAL VIEW */}
      {modalType === "view" && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "650px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Request Detail</h2>
            </div>
            <div style={pastelStyles.modalBody}>
              {detailLoading ? (
                "Loading..."
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
                          <FaBox /> Asset Information
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
                          <FaWarehouse /> Warehouse Information
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
                      <FaUserCircle /> Requester Information
                    </h4>
                    <p style={valStyle}>
                      <b>Name:</b> {viewingReport?.creator?.fullName}
                    </p>
                    <p style={valStyle}>
                      <b>Stage:</b> {viewingReport?.currentStage}
                    </p>
                    {viewingReport?.type === 4 && (
                      <div
                        style={{
                          background: "#fff7ed",
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #ffedd5",
                          marginTop: 10,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: "bold",
                            color: "#c2410c",
                          }}
                        >
                          NEW LOCATION TARGET
                        </p>
                        <p style={{ fontSize: 13 }}>
                          <b>Lat:</b> {viewingReport.newLatitude} | <b>Long:</b>{" "}
                          {viewingReport.newLongitude}
                        </p>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      gridColumn: "span 2",
                      background: "#f8fafc",
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: "bold",
                        color: "#64748b",
                      }}
                    >
                      CONTENT / REASON
                    </p>
                    <p style={{ fontStyle: "italic", fontSize: 13, margin: 0 }}>
                      {viewingReport?.description || viewingReport?.reason}
                    </p>
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

      {/* SELECT TYPE */}
      {modalType === "selectType" && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "380px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>New Request</h2>
            </div>
            <div style={{ padding: 15, display: "grid", gap: 10 }}>
              <button
                className="select-item"
                onClick={() => setModalType("addPersonalAsset")}
              >
                <FaBox color="#3b82f6" /> <span>Personal Asset</span>
              </button>
              <button
                className="select-item"
                onClick={() => setModalType("addWarehouseAsset")}
              >
                <FaWarehouse color="#10b981" /> <span>Warehouse Item</span>
              </button>
              {userRole === "WarehouseManager" && (
                <>
                  <button
                    className="select-item"
                    onClick={() => {
                      setFormData({ ...formData, type: 4 });
                      setModalType("addWhLocation");
                    }}
                  >
                    <FaMapMarkerAlt color="#f59e0b" />{" "}
                    <span>Move Warehouse</span>
                  </button>
                  <button
                    className="select-item"
                    onClick={() => {
                      setFormData({ ...formData, type: 5 });
                      setModalType("addWhDelete");
                    }}
                  >
                    <FaExclamationTriangle color="#ef4444" />{" "}
                    <span>Delete Warehouse</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORM ASSET */}
      {modalType.includes("Asset") && (
        <div style={pastelStyles.modalOverlay} onClick={closeModal}>
          <div
            style={{ ...pastelStyles.modal, maxWidth: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={pastelStyles.modalHeader}>
              <h2 style={pastelStyles.modalTitle}>Asset Form</h2>
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

      {/* FORM WAREHOUSE */}
      {(modalType.includes("Wh") || modalType === "editWarehouse") &&
        !modalType.includes("Asset") && (
          <div style={pastelStyles.modalOverlay} onClick={closeModal}>
            <div
              style={{ ...pastelStyles.modal, maxWidth: "400px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={pastelStyles.modalHeader}>
                <h2 style={pastelStyles.modalTitle}>Warehouse Request</h2>
              </div>
              <div style={pastelStyles.modalBody}>
                <label style={pastelStyles.label}>Warehouse</label>
                <select
                  style={pastelStyles.select}
                  value={formData.warehouseID}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseID: e.target.value })
                  }
                >
                  <option value="">-- Select --</option>
                  {myWarehouses.map((w, idx) => (
                    <option key={idx} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
                {Number(formData.type) === 4 && (
                  <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                    <input
                      style={{ ...pastelStyles.select, marginBottom: 0 }}
                      type="number"
                      placeholder="New Lat"
                      value={formData.newLatitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newLatitude: e.target.value,
                        })
                      }
                    />
                    <input
                      style={{ ...pastelStyles.select, marginBottom: 0 }}
                      type="number"
                      placeholder="New Long"
                      value={formData.newLongitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newLongitude: e.target.value,
                        })
                      }
                    />
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
            <h3>Delete Request?</h3>
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
                onClick={executeDelete}
              >
                Yes
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
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: 0.2s;
          font-weight: 600;
          width: 100%;
          font-size: 14px;
        }
        .select-item:hover {
          background: #f1f5f9;
          border-color: #3b82f6;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

function renderStatus(s: number) {
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
        minWidth: 70,
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {m.t}
    </span>
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
    fontSize: "14px",
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
    alignItems: "center",
    gap: "8px",
    borderTop: "1px solid #f1f5f9",
  },
  pageBtn: {
    minWidth: "32px",
    height: "32px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
  pageBtnDisabled: {
    minWidth: "32px",
    height: "32px",
    border: "1px solid #f1f5f9",
    borderRadius: "6px",
    background: "#f8fafc",
    color: "#cbd5e1",
    cursor: "not-allowed",
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
  modal: { background: "white", borderRadius: "12px", overflow: "hidden" },
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
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "15px",
    outline: "none",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    resize: "none",
    fontSize: "14px",
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
