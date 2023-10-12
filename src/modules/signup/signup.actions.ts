/** @format */

import { Either } from 'src/utils/either'

export type Signup = {
  readonly type: 'Signup'
}

export type Signedup = {
  readonly type: 'Signedup'
  readonly result: Either<Error['message'], null>
}

export type SignupAction =
  | Signup
  | Signedup
