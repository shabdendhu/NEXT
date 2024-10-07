"use client";
import React, { ReactNode } from "react";
import store from "@/store";
import { Provider } from "react-redux";

interface Props {
  children: ReactNode;
}

const Providers = (props: Props) => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default Providers;
