"use server";
import axiosManager from "@/utils/axiosManager";
import { createSession } from "@/utils/session";
import { redirect } from "next/navigation";

const onFinish = async (values: any) => {
  try {
    const loginRes = await axiosManager.post("/api/user/login-user", {
      ...values,
    });

    console.log("Received values:", loginRes);

    // Ensure the session is created before redirecting
    await createSession(loginRes);

    // Immediately return the redirect after creating the session
    return loginRes;
  } catch (error) {
    console.error("Login failed:", error);

    // Handle the error gracefully but do not throw it as an error
    return {
      status: "error",
      message: "Login failed. Please try again.",
    };
  }
};

const onFinishFailed = async (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export { onFinish, onFinishFailed };
