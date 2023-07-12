import { combineReducers } from "@reduxjs/toolkit";

import { userReducer } from "./user/user.reducer.js";
import { defectReducer } from "./defect/defect.reducer.js";
import { defectHomeReducer } from "./defect/defect.home.reducer.js";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { defectAllReducer } from "./defect/defect.all.reducer.js";
import { adminReducer } from "./admin/admin.reducer.js";
const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["currentUser.role", "isAdmin"],
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const rootReducer = combineReducers({
  user: persistedReducer,
  defect: defectReducer,
  defectHome: defectHomeReducer,
  defectAll: defectAllReducer,
  admin: adminReducer,
});
