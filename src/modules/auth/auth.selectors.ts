import { RootState } from "src/types";

export const status = (state: RootState) => {
  return state.auth.status
}

export const logoutStatus = (state: RootState) => {
  return state.auth.logoutStatus
}

export const notifyForgotPasswordStatus = (state: RootState) => {
  return state.auth.notifyForgotPasswordStatus
}

export const resetPasswordStatus = (state: RootState) => {
  return state.auth.resetPasswordStatus
}