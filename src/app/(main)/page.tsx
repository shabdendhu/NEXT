"use client";
import { Button } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const user = useSelector((state: any) => state.auth);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="Border-[2px] Border-red-500 flex h-screen">
      <div className="bordser-[5px] Border-green-500 min-w-[250px] bg-blue-300  p-5 flex flex-col gap-5">
        <h1 className="text-[20px]">SIDEBAR</h1>
        <div className="w-full Border-[3px] Border-yellow-500 flex flex-col h-full gap-3 overflow-auto">
          <Button className="w-full">Button</Button>
          <Button className="w-full">Button</Button>
          <Button className="w-full">Button</Button>
        </div>
      </div>
      <div className="Border-[3px] Border-blue-500 flex-1 flex flex-col">
        <div className="Border-[3px] Border-yellow-500 min-h-[50px] bg-green-300 text-[20px] flex items-center px-5">
          HEADER
        </div>
        <div className="flex-1 overflow-auto">BODY</div>
        <div className="Border-[3px] Border-yellow-500 min-h-[50px] bg-pink-300 text-[20px] flex items-center px-5">
          FOOTER
        </div>
      </div>
    </div>
  );
};

export default page;
