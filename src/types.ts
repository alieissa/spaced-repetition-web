/** @format */

import { AxiosInstance } from 'axios'

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

export type RequestError = { message: string; cause?: number }


export type AppContext = {
  api: AxiosInstance
}