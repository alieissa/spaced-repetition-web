import { Async } from 'src/utils/async'
export namespace NLogin {
  export type State = {
    status: Async<null, Error['message'], string>
  }

  export type User = {
    email: string,
    password: string
  }
}