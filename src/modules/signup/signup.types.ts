import { Async } from 'src/utils/async'
export namespace NSignup {
  export type State = {
    status: Async<null, Error['message'], null>
  }

  export type User = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmedPassword: string
  }
}