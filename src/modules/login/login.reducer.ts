/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import type { LoginAction } from './login.actions'
import { NLogin } from './login.types'

const initialState: NLogin.State = {
  status: Untriggered(),
}

export default produce((draft: NLogin.State, action: LoginAction) => {
  switch (action.type) {
    case 'Login': {
      draft.status = Loading(null)
      return
    }
    case 'LoggedIn': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.status = Failure(value)
        },
        Right: ({ value }) => {
          draft.status = Success(value)
        },
      })
      return
    }
  }
}, initialState)
