/** @format */

import { createSelector } from 'reselect'
import { RootState } from 'src/types'

const selectVerification = (state: RootState) => state.verification
export const status = createSelector([selectVerification], verification => verification.status)
