"use client"
import React, { useState, useEffect } from 'react';
import { HomeOutlined, DollarOutlined, MenuUnfoldOutlined, MenuFoldOutlined , ApartmentOutlined, FileProtectOutlined} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/assets/logo';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text, collapsed, isActive }) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 ${
      collapsed ? 'justify-center' : 'justify-start'
    } ${
      isActive 
        ? 'bg-gray-200 text-black' 
        : 'bg-white text-gray-600 hover:bg-gray-300 border'
    }`}
  >
    {icon}
    {!collapsed && <span className='text-[12px] font-bold'>{text}</span>}
  </Link>
);

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activePath, setActivePath] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`bg-white p-5 flex flex-col justify-between h-screen transition-all duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[250px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center ml-1">
        <Logo className={`transition-all duration-300 ${collapsed ? 'w-8' : 'w-12'}`} />
        {!collapsed && <h1 className="text-[20px] font-bold ml-2">Admin</h1>}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-5 flex-grow mt-10 ">
        <NavLink 
          href="/credit-manager" 
          icon={<HomeOutlined />} 
          text="Credit Manager"
          collapsed={collapsed}
          isActive={activePath === '/credit-manager'}
        />
        <NavLink 
          href="/credit-transaction" 
          icon={<DollarOutlined />} 
          text="Credit Transaction"
          collapsed={collapsed}
          isActive={activePath === '/credit-transaction'}
        />
        <NavLink 
          href="/taskManagement" 
          icon={<FileProtectOutlined />} 
          text="Task Management"
          collapsed={collapsed}
          isActive={activePath === '/taskManagement'}
        />
        <NavLink 
          href="/portal" 
          icon={<ApartmentOutlined />} 
          text="Portal"
          collapsed={collapsed}
          isActive={activePath === '/portal'}
        />
        <NavLink 
          href="/report" 
          icon={<ApartmentOutlined />} 
          text="Report"
          collapsed={collapsed}
          isActive={activePath === '/report'}
        />
      </div>

      {/* Toggle Button */}
      <button
        className="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
        onClick={toggleSidebar}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
    </div>
  );
};

export default Sidebar;