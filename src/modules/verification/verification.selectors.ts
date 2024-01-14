/** @format */

import { RootState } from 'src/types'

export const status = (state: RootState) => {
  return state.verification.status
}
