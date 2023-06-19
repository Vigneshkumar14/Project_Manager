import { combineReducers } from "@reduxjs/toolkit";

import { userReducer } from "./user/user.reducer.js";
import { defectReducer } from "./defect/defect.reducer.js";
import { defectHomeReducer } from "./defect/defect.home.reducer.js";

export const rootReducer = combineReducers({
  user: userReducer,
  defect: defectReducer,
  defectHome: defectHomeReducer,
});
