import { authReducer } from "@/redux/auth";
import { configureStore } from "@reduxjs/toolkit";
export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
