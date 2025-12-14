"use client";

import React, { FC } from "react";
import Link from "next/link";
// Import các icons mới từ react-icons/fa
import {
  FaTachometerAlt,
  FaCube,
  FaWarehouse,
  FaUserCircle,
  FaTools,
  FaEnvelopeOpenText,
  FaBell,
} from "react-icons/fa";

import { sidebarSelector } from "@/redux/reducers/sidebarReducer";
import { useSelector } from "react-redux";

interface Props {
  collapse?: boolean;
}

const Sidebar: FC<Props> = ({ collapse = false }) => {
  const paramLoc = useSelector(sidebarSelector);

  return (
    <>
      <div className="app-sidebar" style={{ width: collapse ? 0 : 250 }}>
        {/* LOGO TEXT */}
        <Link className="app-sidebar__logo" href="/">
          <div className="logo-text">AMS</div>
        </Link>

        <div className="app-sidebar__menu">
          {/* DASHBOARD */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "home" && "active"
            }`}
            href="/"
          >
            <FaTachometerAlt /> {/* ICON MỚI */}
            Dashboard
          </Link>

          {/* ASSETS */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "asset" && "active"
            }`}
            href="/Assets"
          >
            <FaCube /> {/* ICON MỚI */}
            Assets
          </Link>

          {/* WAREHOUSE */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "warehouse" && "active"
            }`}
            href="/Warehouse"
          >
            <FaWarehouse /> {/* ICON MỚI */}
            Warehouse
          </Link>

          {/* ACCOUNT */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "account" && "active"
            }`}
            href="/Accounts"
          >
            <FaUserCircle /> {/* ICON MỚI */}
            Account
          </Link>

          {/* WORK */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "work" && "active"
            }`}
            href="/Works"
          >
            <FaTools /> {/* ICON MỚI */}
            Work
          </Link>

          {/* REQUESTS */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "request" && "active"
            }`}
            href="/Requests"
          >
            <FaEnvelopeOpenText /> {/* ICON MỚI */}
            Requests
          </Link>

          {/* NOTIFICATION */}
          <Link
            className={`app-sidebar__menu__item ${
              paramLoc.sidebarData == "notification" && "active"
            }`}
            href="/Notifications"
          >
            <FaBell /> {/* ICON MỚI */}
            Notification
          </Link>
        </div>
      </div>

      <style jsx>{`
        .app-sidebar {
          background: #0e1a2b;
          color: #ffffff;
          /* 🔥 Xóa height: 100vh để sidebar tự co giãn theo nội dung chính */
          min-height: 100vh; /* Đảm bảo nó luôn cao ít nhất bằng viewport */
          height: 100%; /* Cho phép nó kéo dài (nếu container cha là flex/grid) */
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          overflow-y: auto; /* Cho phép cuộn bên trong nếu menu quá dài */
        }

        /* LOGO TEXT STYLE */
        .logo-text {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 2px;
          text-shadow: 0 3px 8px rgba(255, 255, 255, 0.2);
        }

        .app-sidebar__logo {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          text-decoration: none;
        }

        .app-sidebar__menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .app-sidebar__menu__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          color: #d9e2f1;
          font-size: 15px;
          font-weight: 500;
          transition: 0.25s ease;
        }

        .app-sidebar__menu__item svg {
          /* Điều chỉnh kích thước và màu sắc của icon */
          font-size: 18px;
          color: #9ab3d1;
          transition: 0.25s ease;
        }

        .app-sidebar__menu__item:hover {
          background: #1c2d45;
          color: #ffffff;
        }

        .app-sidebar__menu__item:hover svg {
          color: #ffffff;
        }

        .app-sidebar__menu__item.active {
          background: #2b4570;
          color: #ffffff;
          font-weight: 600;
        }

        .app-sidebar__menu__item.active svg {
          color: #ffffff;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
