/** @format */

import { Decks } from 'src/modules/decks/decks.types'
import { NLogin } from 'src/modules/login'
import { NSignup } from 'src/modules/signup'

/** @format */
// export type Optional<T, K extends string | number | symbol> = Omit<T, K> & Partial<Pick<T, K>>

export type WithItem<T, V extends keyof I, I> = T & Pick<I, V>
export interface Settings {
  readonly easiness: number
  readonly quality: number
  readonly interval: number
  readonly createdAt?: number
  readonly updatedAt?: number
}
export type WithSettings<T, V extends keyof Settings = keyof Settings> = T &
  Pick<Settings, V>

export type RootState = {
  decks: Decks.State
  login: NLogin.State
  signup: NSignup.State
}
