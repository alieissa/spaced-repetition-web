/** @format */

/**
 * Credit goes to https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c
 * For the pattern matching code
 */
export type Right<V> = Readonly<{
  type: 'Right'
  value: V
}>
export function Right<V>(v: V): Right<V> {
  return {
    type: 'Right',
    value: v,
  }
}

export type Left<E = Error> = Readonly<{
  type: 'Left'
  value: E
}>
export function Left<E>(e: E): Left<E> {
  return {
    type: 'Left',
    value: e,
  }
}

export type Either<L, R> = Left<L> | Right<R>

export type EitherType<L, R> = Either<L, R>['type']
export type EitherMap<L, R, U> = {
  [K in EitherType<L, R>]: U extends { type: K } ? U : never
}
export type EitherTypeMap<L, R> = EitherMap<L, R, Either<L, R>>
export type EitherPattern<T, L, R> = {
  [K in keyof EitherTypeMap<L, R>]: (either: EitherTypeMap<L, R>[K]) => T
}

export function match<L, R>(
  e: Either<L, R>,
): <T>(pattern: EitherPattern<T, L, R>) => T {
  return <T>(pattern: EitherPattern<T, L, R>) => pattern[e.type](e as any)
}
