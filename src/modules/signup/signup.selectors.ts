import { RootState } from "src/types";

export const status = (state: RootState) => {
  return state.signup.status
}