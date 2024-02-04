import { RootState } from "src/types";

export const status = (state: RootState) => {
  return state.auth.status
}

export const logoutStatus = (state: RootState) => {
  return state.auth.logoutStatus
}