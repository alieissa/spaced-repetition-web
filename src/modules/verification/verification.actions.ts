/** @format */

import { Either } from 'src/utils/either'

export type Verify = {
  readonly type: 'Verify'
}

export type Verified = {
  readonly type: 'Verified'
  readonly result: Either<Error['message'], string>
}

export type VerificationAction = Verify | Verified
