/** @format */

import { Either } from 'src/utils/either'

export type Login = {
  readonly type: 'Login'
}

export type LoggedIn = {
  readonly type: 'LoggedIn'
  readonly result: Either<Error['message'], string>
}

export type LoginAction =
  | Login
  | LoggedIn
