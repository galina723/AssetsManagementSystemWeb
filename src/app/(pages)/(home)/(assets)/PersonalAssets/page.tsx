"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaShieldAlt,
  FaUser,
  FaTag,
} from "react-icons/fa";

interface AssetModel {
  assetID: number;
  name: string;
  code: string;
  owner: string;
  position: string;
  dateOfPurchase: string;
  price: number;
  currency: string;
  unit: string;
  status: string;
  note: string;
  purpose: string;
  supplier: string;
  warrantyDuration: number;
  warrantyDepartment: string;
  totalQuantity: number;
  availableQuantity: number;
  isInWarehouse: boolean;
}

export default function PersonalAssetsPage() {
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<AssetModel | null>(null);

  const BASE_URL = "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

  const fetchMyAssets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/Asset/my-assets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setAssets(res.data.data || []);
    } catch (err) {
      console.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssets();
  }, []);

  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const currentAssets = assets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading)
    return <div style={styles.loadingContainer}>Loading Assets...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Assets</h1>
        </div>
      </div>

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
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Asset Name</th>
                <th style={styles.th}>Position</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAssets.map((asset, index) => (
                <tr
                  key={`asset-${asset.assetID}-${index}`}
                  className="table-row-style"
                >
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>#{asset.code}</span>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    {asset.name}
                  </td>
                  <td style={styles.td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaMapMarkerAlt size={12} color="#94a3b8" />
                      {asset.position || "N/A"}
                    </div>
                  </td>
                  <td style={styles.td}>
                    {asset.availableQuantity} {asset.unit}
                  </td>
                  <td style={styles.td}>{renderStatus(asset.status)}</td>
                  <td style={{ ...styles.td, ...styles.actionCol }}>
                    <button
                      style={{ ...styles.iconBtn, ...styles.viewBtn }}
                      onClick={() => {
                        setViewingAsset(asset);
                        setOpenDetailModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={styles.pageBtn}
            >
              <FaChevronLeft />
            </button>
            <span style={{ fontSize: 13 }}>
              Page <b>{currentPage}</b> / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={styles.pageBtn}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL - SHOW ALL INFORMATION */}
      {openDetailModal && viewingAsset && (
        <div
          style={styles.modalOverlay}
          onClick={() => setOpenDetailModal(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaInfoCircle color="#3b82f6" />
                <h2 style={styles.modalTitle}>Full Asset Information</h2>
              </div>
            </div>

            <div style={styles.modalBodyScroll}>
              {/* Group 1: General Info */}
              <div style={styles.sectionTitle}>
                <FaTag /> General Information
              </div>
              <div style={styles.detailGrid}>
                <DetailItem label="Asset Name" value={viewingAsset.name} />
                <DetailItem
                  label="Asset Code"
                  value={`#${viewingAsset.code}`}
                />
                <DetailItem
                  label="Status"
                  value={renderStatus(viewingAsset.status)}
                />
                <DetailItem label="Purpose" value={viewingAsset.purpose} />
                <DetailItem label="Location" value={viewingAsset.position} />
                <DetailItem label="Owner" value={viewingAsset.owner} />
              </div>

              {/* Group 2: Inventory & Value */}
              <div style={styles.sectionTitle}>
                <FaMoneyBillWave /> Inventory & Value
              </div>
              <div style={styles.detailGrid}>
                <DetailItem
                  label="Available Quantity"
                  value={`${viewingAsset.availableQuantity} ${viewingAsset.unit}`}
                />
                <DetailItem
                  label="Total Quantity"
                  value={`${viewingAsset.totalQuantity} ${viewingAsset.unit}`}
                />
                <DetailItem
                  label="Price"
                  value={`${viewingAsset.price?.toLocaleString()} ${viewingAsset.currency}`}
                />
                <DetailItem
                  label="In Warehouse"
                  value={viewingAsset.isInWarehouse ? "Yes" : "No"}
                />
              </div>

              {/* Group 3: Purchase & Warranty */}
              <div style={styles.sectionTitle}>
                <FaCalendarAlt /> Purchase & Warranty
              </div>
              <div style={styles.detailGrid}>
                <DetailItem
                  label="Purchase Date"
                  value={new Date(
                    viewingAsset.dateOfPurchase,
                  ).toLocaleDateString("en-GB")}
                />
                <DetailItem label="Supplier" value={viewingAsset.supplier} />
                <DetailItem
                  label="Warranty Duration"
                  value={`${viewingAsset.warrantyDuration} months`}
                />
                <DetailItem
                  label="Warranty Dept"
                  value={viewingAsset.warrantyDepartment}
                />
              </div>

              {/* Group 4: Notes */}
              <div style={styles.sectionTitle}>
                <FaInfoCircle /> Internal Notes
              </div>
              <div style={styles.noteArea}>
                {viewingAsset.note ||
                  "No additional notes provided for this asset."}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.saveBtn}
                onClick={() => setOpenDetailModal(false)}
              >
                Close Window
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
      <div style={styles.detailValue}>{value || "---"}</div>
    </div>
  );
}

function renderStatus(status: string) {
  const s = status?.toLowerCase() || "";
  let config = { t: status, b: "#f1f5f9", c: "#475569" };
  if (["available", "active", "good", "normal"].includes(s))
    config = { t: status, b: "#dcfce7", c: "#15803d" };
  else if (["broken", "damaged", "lost"].includes(s))
    config = { t: status, b: "#fee2e2", c: "#b91c1c" };
  else config = { t: status, b: "#fef3c7", c: "#b45309" };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "16px",
        background: config.b,
        color: config.c,
        fontSize: "11px",
        fontWeight: 700,
        minWidth: 75,
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {config.t}
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
  subtitle: { fontSize: "13px", color: "#64748b" },
  badgeCount: {
    background: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    color: "#3b82f6",
    fontWeight: "700",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
    background: "#f8fafc",
    textAlign: "left",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
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
  typeBadge: {
    background: "#e0e7ff",
    color: "#4338ca",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  pagination: {
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
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
    maxWidth: "600px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  modalTitle: { margin: 0, fontSize: "18px", color: "#0f172a" },
  modalBodyScroll: { padding: "20px", overflowY: "auto", flex: 1 },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#3b82f6",
    textTransform: "uppercase",
    marginBottom: "15px",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderBottom: "1px solid #eff6ff",
    paddingBottom: "5px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  detailLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  detailValue: { fontSize: "13px", color: "#1e293b", fontWeight: 600 },
  noteArea: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#475569",
    border: "1px solid #f1f5f9",
    lineHeight: 1.6,
  },
  modalActions: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "flex-end",
    background: "#f8fafc",
  },
  saveBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
