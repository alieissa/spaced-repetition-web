/** @format */

import { Either } from 'src/utils/either'

export type Login = {
  type: 'Login'
}

export type LoggedIn = {
  type: 'LoggedIn'
  result: Either<Error['message'], string>
}

export type Logout = {
  type: 'Logout'
}

export type LoggedOut = {
  type: 'LoggedOut'
  result: Either<Error['message'], string>
}

export type LoginAction = Login | LoggedIn | Logout | LoggedOut
