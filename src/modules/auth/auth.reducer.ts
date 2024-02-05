/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import type { LoginAction } from './auth.actions'
import { NAuth } from './auth.types'

const initialState: NAuth.State = {
  status: Untriggered(),
  logoutStatus: Untriggered(),
}

export default produce((draft: NAuth.State, action: LoginAction) => {
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
    case 'Logout': {
      draft.logoutStatus = Untriggered()
      return
    }
    case 'LoggedOut': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.logoutStatus = Failure(value)
        },
        Right: ({ value }) => {
          localStorage.removeItem('token')
          draft.logoutStatus = Success(value)
        },
      })

      return
    }
  }
}, initialState)
