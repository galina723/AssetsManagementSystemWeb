"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBell,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const mainPastelColor = "#a0c4ff";
const mainPastelTextColor = "#3d5a80";

export default function NotificationPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // Chỉnh lên 6 để grid 3 cột nhìn cân đối hơn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/notification",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          },
        );
        setList(res.data?.data || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = list.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getTypeTheme = (type: number) => {
    switch (type) {
      case 0:
        return { color: "#a0c4ff", icon: <FaInfoCircle /> };
      case 1:
        return { color: "#caffbf", icon: <FaCheckCircle /> };
      case 2:
        return { color: "#ffd6a5", icon: <FaExclamationTriangle /> };
      case 3:
        return { color: "#ffadad", icon: <FaTimesCircle /> };
      default:
        return { color: "#dee2e6", icon: <FaBell /> };
    }
  };

  // Logic kiểm tra xem có mới trong vòng 24h không
  const isRecent = (dateStr: string) => {
    const createdDate = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  if (loading) return <div style={styles.loadingContainer}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Notifications</h1>
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div className="noti-grid">
        {currentItems.length === 0 ? (
          <div style={styles.empty}>No notifications found.</div>
        ) : (
          currentItems.map((item, index) => {
            const theme = getTypeTheme(item.type);
            const seqNo = startIndex + index + 1;
            const showNewTag = !item.isRead && isRecent(item.createdDate);

            return (
              <div
                key={item.notificationID}
                className="noti-card"
                style={{
                  ...styles.notiCard,
                  borderLeft: `6px solid ${theme.color}`,
                }}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.seqBadge}>#{seqNo}</span>
                  <div
                    style={{
                      ...styles.iconWrapper,
                      backgroundColor: theme.color + "33",
                      color: theme.color,
                    }}
                  >
                    {theme.icon}
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.notiTitle}>{item.title}</div>
                  <div style={styles.notiDesc}>{item.description}</div>
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.notiTime}>
                    <FaClock size={12} style={{ marginRight: 6 }} />
                    {new Date(item.createdDate).toLocaleString("en-GB")}
                  </div>
                  {showNewTag && (
                    <div className="bling-tag" style={styles.unreadTag}>
                      New
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={currentPage === 1}
            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1 }}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <FaChevronLeft size={14} /> Prev
          </button>

          <div style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                style={{
                  ...styles.numBtn,
                  background:
                    currentPage === i + 1 ? mainPastelColor : "transparent",
                  color: currentPage === i + 1 ? "#fff" : "#333",
                  border:
                    currentPage === i + 1
                      ? `1px solid ${mainPastelColor}`
                      : "1px solid #ddd",
                }}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            style={{
              ...styles.pageBtn,
              opacity: currentPage === totalPages ? 0.3 : 1,
            }}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next <FaChevronRight size={14} />
          </button>
        </div>
      )}

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        .noti-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .noti-grid {
            grid-template-columns: 1fr;
          }
        }
        .noti-card {
          transition: all 0.3s ease;
        }
        .noti-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
        }

        /* Hiệu ứng Bling Bling cho tag New */
        .bling-tag {
          animation: blink-shadow 1.5s infinite ease-in-out;
        }

        @keyframes blink-shadow {
          0% {
            box-shadow: 0 0 0 0 rgba(160, 196, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(160, 196, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(160, 196, 255, 0);
          }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  container: {
    padding: "40px",
    background: "#f8f9fc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: mainPastelTextColor,
    margin: 0,
  },
  pageIndicator: {
    background: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  notiCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    position: "relative",
    border: "1px solid #edf2f7",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    width: "45px",
    height: "45px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },
  seqBadge: { fontSize: "12px", fontWeight: "800", color: "#cbd5e0" },
  notiTitle: {
    fontWeight: "750",
    color: "#1a202c",
    fontSize: "18px",
    marginBottom: "8px",
  },
  notiDesc: { fontSize: "14px", color: "#4a5568", lineHeight: "1.6" },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    paddingTop: "15px",
    borderTop: "1px solid #f7fafc",
  },
  notiTime: {
    fontSize: "11px",
    color: "#a0aec0",
    display: "flex",
    alignItems: "center",
    fontWeight: "600",
  },
  unreadTag: {
    background: mainPastelColor,
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "50px",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "10px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: mainPastelTextColor,
  },
  pageNumbers: { display: "flex", gap: "8px" },
  numBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: mainPastelTextColor,
  },
};

// Reuse subtitle style
const pastelStyles = {
  subtitle: { color: "#8e9aaf", fontSize: "15px", marginTop: "5px" },
};
