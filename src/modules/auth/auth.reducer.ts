/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import type { LoginAction } from './auth.actions'
import { NAuth } from './auth.types'

const initialState: NAuth.State = {
  status: Untriggered(),
  logoutStatus: Untriggered(),
  notifyForgotPasswordStatus: Untriggered(),
}

export default produce((draft: NAuth.State, action: LoginAction) => {
  switch (action.type) {
    case 'Login': {
      draft.status = Loading(null)
      draft.logoutStatus = Untriggered()
      return
    }
    case 'LoggedIn': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.status = Failure(value)
        },
        Right: ({ value }) => {
          const storage = action.rememberMe ? localStorage : sessionStorage
          storage.setItem('token', value.token)
          draft.status = Success(value)
        },
      })
      return
    }
    case 'ResetLogin': {
      draft.status = Untriggered()
      return
    }
    case 'Logout': {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      draft.logoutStatus = Loading(null)
      draft.status = Untriggered()
      return
    }
    case 'LoggedOut': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.logoutStatus = Failure(value)
        },
        Right: ({ value }) => {
          draft.logoutStatus = Success(value)
        },
      })

      return
    }
    case 'NotifyForgotPassword': {
      draft.notifyForgotPasswordStatus = Loading(null)
      return
    }
    case 'ForgotPasswordNotified': {
      either.match(action.result)({
        Right: ({}) => {
          draft.notifyForgotPasswordStatus = Success(null)
        },
        Left: ({ value }) => {
          draft.notifyForgotPasswordStatus = Failure(value)
        },
      })
      return
    }
  }
}, initialState)
