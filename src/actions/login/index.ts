"use server";
import axiosManager from "@/utils/axiosManager";
import { createSession } from "@/utils/session";
import { redirect } from "next/navigation";

const onFinish = async (values: any) => {
  const loginRes = await axiosManager.post("/api/user/login-user", {
    ...values,
  });
  console.log("Received values:", loginRes);
  createSession(loginRes);
  redirect("/");
  // if (loginRes?.users) {
  //   dispatch(loginSuccess(loginRes));
  //   router.push("/");
  //   console.log("Received values:", loginRes);
  // } else {
  //   dispatch(loginFailure(loginRes));
  // }
};
const onFinishFailed = async (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export { onFinish, onFinishFailed };
