/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { SignupAction } from './signup.actions'
import { NSignup } from './signup.types'

const initialState: NSignup.State = {
  status: Untriggered(),
}

export default produce((draft: NSignup.State, action: SignupAction) => {
  switch (action.type) {
    case 'Signup': {
      draft.status = Loading(null)
      return
    }
    case 'Signedup': {
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
}, initialState)
