import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'
export namespace NAuth {
  export type State = {
    status: Async<null, Error['message'], UserToken>
    logoutStatus: Async<null, Error['message'], string>
    notifyForgotPasswordStatus: Async<null, RequestError, null>
  }

  export type User = {
    email: string,
    password: string,
  }
  export type UserToken = {
    token: string
  }
  export type UserForm = User & {
    rememberMe: boolean
  }
  export type ForgotPasswordForm = {
    email: string
  }
}