"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import { onFinish, onFinishFailed } from "@/actions/login";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();

  const handleFinish = async (values: any) => {
    try {
      // Call the server action and await the response
      const response = await onFinish(values);

      // Check if the response is successful
      if (response?.data?.id) {
        // If successful, redirect the user
        console.log("====================================");
        console.log(response);
        console.log("====================================");
        router.push("/");
      } else {
        // Handle errors (optional: show error to the user)
        console.error(response.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
        className="flex flex-col w-full sm:w-[500px] sm:min-h-[500px] rounded-lg  p-6"
      >
        <h1
          // onClick={() => console.log(user)}
          className="text-2xl font-bold mb-4"
        >
          Login
        </h1>
        <Form
          name="login-form"
          layout="vertical"
          onFinish={handleFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
