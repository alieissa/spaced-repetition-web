/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { VerificationAction } from './verification.actions'
import { NVerification } from './verification.types'

const initialState: NVerification.State = {
  status: Untriggered(),
}

export default produce(
  (draft: NVerification.State, action: VerificationAction) => {
    switch (action.type) {
      case 'Verify': {
        draft.status = Loading(null)
        return
      }
      case 'Verified': {
        either.match(action.result)({
          Left: ({ value }) => {
            draft.status = Failure(value)
          },
          Right: () => {
            draft.status = Success(null)
          },
        })
        return
      }
    }
  },
  initialState,
)
