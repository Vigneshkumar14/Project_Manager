import { combineReducers } from "@reduxjs/toolkit";

import { userReducer } from "./user/user.reducer.js";
import { defectReducer } from "./defect/defect.reducer.js";

export const rootReducer = combineReducers({
  user: userReducer,
  defect: defectReducer,
});
