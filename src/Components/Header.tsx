// components/Header.tsx
import React, { useEffect } from "react";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
export default function Header() {
  return (
    <div className="min-h-[80px] bg-blue-600  hover:bg-blue-700 text-[20px] text-white flex items-center px-5 " >
      <div className="flex items-center ml-auto space-x-4">
            <BellOutlined style={{ fontSize: "28px" }} />
            <UserOutlined style={{ fontSize: "28px" }} />
          </div>
    </div>
    
  );
}