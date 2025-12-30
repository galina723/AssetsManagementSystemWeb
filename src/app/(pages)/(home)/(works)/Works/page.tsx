"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaTrash, FaEye } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Box,
  Chip,
} from "@mui/material";

export default function WorkPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [workToDeleteId, setWorkToDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewingWork, setViewingWork] = useState<any>(null);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // GET DATA
  const fetchWorks = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/get-work-createdList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setWorks(res.data?.data || []);
    } catch (e) {
      console.log("Work API error:", e);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setAssets(res.data?.data || []);
    } catch (e) {
      console.log("Asset API error:", e);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setAccounts(res.data?.data || []);
    } catch (e) {
      console.log("Account API error:", e);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchAssets(), fetchWorks(), fetchAccounts()]);
      setLoading(false);
    };
    load();
  }, []);

  // HELPERS
  const findAssetName = (id: any) => {
    const found = assets.find((a: any) => a.assetID === id);
    return found ? found.name : "Unknown Asset";
  };

  const findCreatorName = (userId: any) => {
    const found = accounts.find((acc: any) => acc.userID === userId);
    return found ? found.fullName : "Unknown User";
  };

  // ACTIONS
  const openConfirmDelete = (id: number) => {
    setWorkToDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleShowDetail = (work: any) => {
    setViewingWork(work);
    setOpenDetailModal(true);
  };

  const handleDelete = async () => {
    if (!workToDeleteId) return;
    setDeleting(true);
    try {
      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/${workToDeleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenDeleteModal(false);
      fetchWorks();
    } catch (e) {
      alert("Failed to delete work!");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ padding: 10, background: "#fcfcfc", minHeight: "100vh" }}>
        <CircularProgress size={30} sx={{ color: mainPastelColor }} />
      </Box>
    );

  return (
    <>
      <div style={pastelStyles.container}>
        <div style={pastelStyles.header}>
          <div style={pastelStyles.title}>Works List</div>
          <button
            onClick={() => router.push("/CreateWork")}
            style={pastelStyles.addBtn}
            className="add-btn-style"
          >
            + Add Work
          </button>
        </div>

        <div style={pastelStyles.card}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={pastelStyles.thSmall}>#</th>
                <th style={pastelStyles.th}>Work Name</th>
                <th style={pastelStyles.th}>Asset</th>
                <th style={pastelStyles.th}>Due Date</th>
                <th style={pastelStyles.th}>Status</th>
                <th style={{ ...pastelStyles.th, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {works.map((item, index) => (
                <tr key={item.workID} className="table-row-style">
                  <td style={{ ...pastelStyles.td, textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={pastelStyles.td}>{item.name}</td>
                  <td style={pastelStyles.td}>{findAssetName(item.assetID)}</td>
                  <td style={pastelStyles.td}>{item.dueDate?.slice(0, 10)}</td>
                  <td style={pastelStyles.td}>
                    <span
                      className={`status-tag ${item.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.status || "Unknown"}
                    </span>
                  </td>
                  <td style={{ ...pastelStyles.td, ...pastelStyles.actionCol }}>
                    <button
                      onClick={() => handleShowDetail(item)}
                      style={{
                        ...pastelStyles.iconBtn,
                        background: mainPastelColor,
                        color: mainPastelTextColor,
                      }}
                      title="View Details"
                    >
                      <FaEye size={14} />
                    </button>
                    <button
                      onClick={() => openConfirmDelete(item.workID)}
                      style={{
                        ...pastelStyles.iconBtn,
                        ...pastelStyles.delete,
                      }}
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAIL MODAL */}
        <Dialog
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              color: mainPastelTextColor,
              background: "#f8faff",
            }}
          >
            Work Details
          </DialogTitle>
          <Divider />
          <DialogContent>
            {viewingWork && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DetailItem
                  label="Work Name"
                  value={viewingWork.name}
                  isTitle
                />
                <DetailItem
                  label="Description"
                  value={viewingWork.description}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <DetailItem
                    label="Target Asset"
                    value={findAssetName(viewingWork.assetID)}
                  />
                  <DetailItem label="Status" value={viewingWork.status} />
                  <DetailItem
                    label="Due Date"
                    value={new Date(viewingWork.dueDate).toLocaleDateString()}
                  />
                  <DetailItem
                    label="Created By"
                    value={findCreatorName(viewingWork.createdBy)}
                  />
                </Box>
                <Divider />
                <Typography
                  variant="caption"
                  sx={{ color: "#8e9aaf", fontWeight: 700 }}
                >
                  ASSIGNMENTS
                </Typography>
                {viewingWork.assignments?.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {viewingWork.assignments.map((a: any) => (
                      <Chip
                        key={a.id}
                        label={a.fullName || "Assignee"}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No assignments found.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, background: "#f8faff" }}>
            <Button
              onClick={() => setOpenDetailModal(false)}
              variant="contained"
              fullWidth
              sx={{
                background: mainPastelColor,
                color: mainPastelTextColor,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRMATION MODAL */}
        <Dialog
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
        >
          <DialogTitle sx={{ color: deletePastelColor, fontWeight: 700 }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography color="#4a4a4a">
              Are you sure you want to delete this work?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpenDeleteModal(false)}
              sx={{ color: "#6a798a" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              sx={{ backgroundColor: deletePastelColor, color: "#610000" }}
            >
              {deleting ? (
                <CircularProgress size={20} sx={{ color: "#610000" }} />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <style jsx global>{`
        .table-row-style:nth-child(even) {
          background-color: #f9fbfd !important;
        }
        .table-row-style:hover {
          background-color: #eef2ff !important;
        }
        .add-btn-style:hover {
          background: linear-gradient(145deg, #a0c4ff, #b8cffc) !important;
          transform: translateY(-1px) !important;
        }
        .status-tag {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        .status-tag.new {
          background: #e2e3ff;
          color: #383d7c;
        }
        .status-tag.completed {
          background: #d4edda;
          color: #155724;
        }
      `}</style>
    </>
  );
}

const DetailItem = ({ label, value, isTitle = false }: any) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        color: "#8e9aaf",
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: "10px",
      }}
    >
      {label}
    </Typography>
    <Typography
      variant={isTitle ? "body1" : "body2"}
      sx={{ fontWeight: isTitle ? 700 : 500, color: "#333" }}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

const pastelStyles: any = {
  container: {
    minHeight: "100vh",
    padding: "16px 24px", // Giảm padding container
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#fcfcfc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: "24px", fontWeight: "700", color: mainPastelTextColor }, // Giảm size title
  addBtn: {
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    border: "none",
    color: mainPastelTextColor,
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "8px", // Giảm padding của card bao quanh table
    boxShadow: "0 2px 8px rgba(160, 196, 255, 0.12)",
    border: "1px solid #e0e7f2",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "8px 10px", // Giảm padding th
    fontSize: "13px",
    fontWeight: 700,
    color: "#5c677d",
    background: "#f8faff",
    borderBottom: "2px solid #eef2ff",
  },
  thSmall: {
    textAlign: "center",
    padding: "8px 4px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#5c677d",
    background: "#f8faff",
    borderBottom: "2px solid #eef2ff",
    width: "40px",
  },
  td: {
    fontSize: "13px",
    color: "#444",
    padding: "6px 10px", // Giảm padding td (rất quan trọng)
    borderBottom: "1px solid #f0f4ff",
  },
  actionCol: { display: "flex", gap: "6px", justifyContent: "center" },
  iconBtn: {
    width: "28px", // Thu nhỏ nút
    height: "28px",
    borderRadius: "6px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
  },
  delete: { background: deletePastelColor, color: "#610000" },
};
