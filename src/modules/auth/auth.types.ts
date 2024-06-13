import { Async } from 'src/utils/async'
export namespace NAuth {
  export type State = {
    status: Async<null, Error['message'], UserToken>
    logoutStatus: Async<null, Error['message'], string>
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
}