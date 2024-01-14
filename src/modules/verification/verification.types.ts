/** @format */

import { Async } from 'src/utils/async'
export namespace NVerification {
  export type State = {
    status: Async<null, Error['message'], null>
  }
}
