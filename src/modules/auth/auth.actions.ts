/** @format */

import { Either } from 'src/utils/either'
import { NAuth } from './auth.types'

export type Login = {
  type: 'Login'
}

export type LoggedIn = {
  type: 'LoggedIn'
  rememberMe: boolean,
  result: Either<Error['message'], NAuth.UserToken>
}

export type ResetLogin = {
  type: 'ResetLogin'
}

export type Logout = {
  type: 'Logout'
}

export type LoggedOut = {
  type: 'LoggedOut'
  result: Either<Error['message'], string>
}

export type LoginAction = Login | LoggedIn | ResetLogin | Logout | LoggedOut
