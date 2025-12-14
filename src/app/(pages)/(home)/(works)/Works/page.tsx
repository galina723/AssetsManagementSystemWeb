"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

export default function WorkPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [workToDeleteId, setWorkToDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // GET WORK LIST
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

  // GET ASSET LIST
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

  useEffect(() => {
    const load = async () => {
      await fetchAssets();
      await fetchWorks();
      setLoading(false);
    };
    load();
  }, []);

  // FIND ASSET NAME
  const findAssetName = (id: any) => {
    const found = assets.find((a: any) => a.assetID === id);
    return found ? found.name : "Unknown";
  };

  // OPEN CONFIRM DELETE MODAL
  const openConfirmDelete = (id: number) => {
    setWorkToDeleteId(id);
    setOpenDeleteModal(true);
  };

  const closeConfirmDelete = () => {
    setOpenDeleteModal(false);
    setWorkToDeleteId(null);
  };

  // DELETE WORK
  const handleDelete = async () => {
    if (!workToDeleteId) return;

    setDeleting(true);
    try {
      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/${workToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Deleted!");
      closeConfirmDelete();
      fetchWorks();
    } catch (e) {
      console.log(e);
      alert("Failed to delete work!");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          padding: 40,
          fontSize: 18,
          background: "#fcfcfc",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );

  return (
    <>
      <div style={pastelStyles.container}>
        {/* HEADER */}
        <div style={pastelStyles.header}>
          <div style={pastelStyles.title}> Works List</div>

          <button
            onClick={() => router.push("/CreateWork")}
            style={pastelStyles.addBtn}
            className="add-btn-style"
          >
            + Add Work
          </button>
        </div>

        {/* TABLE */}
        <div style={pastelStyles.card}>
          <table style={pastelStyles.table}>
            <thead>
              <tr>
                <th style={{ ...pastelStyles.th, padding: "10px 8px" }}>#</th>
                <th style={{ ...pastelStyles.th, padding: "10px 8px" }}>
                  Work Name
                </th>
                <th style={{ ...pastelStyles.th, padding: "10px 8px" }}>
                  Asset
                </th>
                <th style={{ ...pastelStyles.th, padding: "10px 8px" }}>
                  Due Date
                </th>
                <th style={{ ...pastelStyles.th, padding: "10px 8px" }}>
                  Status
                </th>
                <th
                  style={{
                    ...pastelStyles.th,
                    textAlign: "center",
                    padding: "10px 8px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {works.map((item, index) => (
                <tr key={item.workID} className="table-row-style">
                  <td
                    style={{
                      ...pastelStyles.td,
                      textAlign: "center",
                      padding: "10px 8px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={{ ...pastelStyles.td, padding: "10px 8px" }}>
                    {item.name}
                  </td>
                  <td style={{ ...pastelStyles.td, padding: "10px 8px" }}>
                    {findAssetName(item.assetID)}
                  </td>
                  <td style={{ ...pastelStyles.td, padding: "10px 8px" }}>
                    {item.dueDate?.slice(0, 10)}
                  </td>

                  {/* ⭐ STATUS TAG */}
                  <td style={{ ...pastelStyles.td, padding: "10px 8px" }}>
                    <span
                      className={`status-tag ${item.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.status || "Unknown"}
                    </span>
                  </td>

                  <td
                    style={{
                      ...pastelStyles.td,
                      ...pastelStyles.actionCol,
                      padding: "10px 8px",
                    }}
                  >
                    <button
                      onClick={() => openConfirmDelete(item.workID)}
                      style={{
                        ...pastelStyles.delete,
                        ...pastelStyles.iconBtn,
                      }}
                      className="delete-icon-btn-style"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        <Dialog open={openDeleteModal} onClose={closeConfirmDelete}>
          <DialogTitle
            sx={{ color: pastelStyles.delete.color, fontWeight: 700 }}
          >
            <FaTrash style={{ marginRight: 8, verticalAlign: "middle" }} />
            Confirm Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography color="#4a4a4a">
              Are you sure you want to delete this work? This action cannot be
              undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={closeConfirmDelete}
              variant="outlined"
              sx={{ textTransform: "none", color: "#6a798a" }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                minWidth: "100px",
                backgroundColor: deletePastelColor,
                color: "#610000",
                "&:hover": { backgroundColor: "#ff8c8c" },
              }}
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

      {/* GLOBAL CSS */}
      <style jsx global>{`
        .table-row-style:nth-child(even) {
          background-color: #f9fbfd !important;
        }
        .table-row-style:hover {
          background-color: #eef2ff !important;
        }

        .add-btn-style {
          transition: all 0.3s ease-in-out !important;
        }
        .add-btn-style:hover {
          background: linear-gradient(145deg, #a0c4ff, #b8cffc) !important;
          box-shadow: 0 8px 20px rgba(160, 196, 255, 0.6) !important;
          transform: translateY(-1px) !important;
        }

        .delete-icon-btn-style:hover {
          background: #ff8c8c !important;
        }

        /* STATUS TAGS */
        .status-tag {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-tag.pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-tag.approved {
          background: #d4edda;
          color: #155724;
        }
        .status-tag.rejected {
          background: #f8d7da;
          color: #721c24;
        }
        .status-tag.completed {
          background: #cce5ff;
          color: #004085;
        }
        .status-tag.in-progress {
          background: #e2e3ff;
          color: #383d7c;
        }

        button {
          font-family: inherit;
        }
      `}</style>
    </>
  );
}

/* INLINE STYLES */
const mainPastelColor = "#a0c4ff";
const mainPastelHoverColor = "#b8cffc";
const mainPastelTextColor = "#3d5a80";
const deletePastelColor = "#ffadad";

const pastelStyles: any = {
  container: {
    minHeight: "100vh",
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "#fcfcfc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: mainPastelTextColor,
    textShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  addBtn: {
    background: `linear-gradient(145deg, ${mainPastelHoverColor}, ${mainPastelColor})`,
    border: "none",
    color: mainPastelTextColor,
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
    boxShadow: "0 6px 15px rgba(160, 196, 255, 0.4)",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(160, 196, 255, 0.15)",
    border: "1px solid #e0e7f2",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 700,
    color: "#5c677d",
    borderBottom: "2px solid #eef2ff",
    background: "#f0f4ff",
  },
  td: {
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #eef2ff",
  },
  actionCol: {
    display: "flex",
    gap: "4px",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: {
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "35px",
    height: "35px",
    border: "none",
    transition: "0.2s",
  },
  delete: {
    background: deletePastelColor,
    color: "#610000",
    boxShadow: "0 3px 8px rgba(255,173,173,0.4)",
  },
};
