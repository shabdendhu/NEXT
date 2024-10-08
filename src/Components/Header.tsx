// components/Header.tsx
"use client";
import React, { useState } from "react";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function Header() {
  const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);
  const [isNotificationDropdownVisible, setNotificationDropdownVisible] =
    useState(false);
  const notificationCount = 4;

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!isUserDropdownVisible);
    setNotificationDropdownVisible(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownVisible(!isNotificationDropdownVisible);
    setUserDropdownVisible(false);
  };

  return (
    <div className="h-[64px] bg-blue-600 hover:bg-blue-700 text-[20px] text-white flex items-center px-5">
      <div className="text-[20px] font-bold">LPG GURU</div> {/* Bold text */}
      <div className="flex items-center ml-auto space-x-4 relative">
        <div
          className="relative cursor-pointer"
          onClick={toggleNotificationDropdown}
        >
          <BellOutlined style={{ fontSize: "28px" }} />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 text-white text-xs flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>

        <UserOutlined
          style={{ fontSize: "28px", cursor: "pointer" }}
          onClick={toggleUserDropdown}
        />
      </div>

      {/* User Dropdown Menu */}
      {isUserDropdownVisible && (
        <div className="absolute top-14 right-8 w-40 bg-white rounded-lg shadow-lg z-50">
          <ul className="py-2">
            <li
              className="px-4 text-black cursor-pointer text-sm"
              onClick={() => {
                setUserDropdownVisible(false);
              }}
            >
              <LogoutOutlined className="mr-2" />
              Logout
            </li>
          </ul>
        </div>
      )}

      {/* Notification Dropdown Menu */}
      {isNotificationDropdownVisible && (
        <div className="absolute top-14 right-20 w-40 bg-white rounded-lg shadow-lg z-50">
          <ul className="py-2">
            {notificationCount > 0 ? (
              <li className="px-4 text-black text-sm">
                You have {notificationCount} new notifications
              </li>
            ) : (
              <li className="px-4 text-black text-sm">No new notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}