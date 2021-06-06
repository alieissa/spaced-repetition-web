/** @format */
/**
 * Credit goes to https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c
 * For the pattern matching code
 */
export type Untriggered = {
  type: 'Untriggered'
}
export function Untriggered(): Untriggered {
  return {
    type: 'Untriggered',
  }
}

const t: Optional<Answer, 'easiness' | 'quality' | 'interval'> = {
  id: '',
  content: 'fsdfds',
}
export type Loading<V> = {
  type: 'Loading'
  value: V
}
export function Loading<V>(v: V): Loading<V> {
  return {
    type: 'Loading',
    value: v,
  }
}

export type Failure<E> = {
  type: 'Failure'
  value: E
}
export function Failure<E>(e: E): Failure<E> {
  return {
    type: 'Failure',
    value: e,
  }
}

export type Success<V> = {
  type: 'Success'
  value: V
}
export function Success<V>(v: V): Success<V> {
  return {
    type: 'Success',
    value: v,
  }
}

export type Async<L = unknown, F = unknown, S = unknown> =
  | Untriggered
  | Loading<L>
  | Failure<F>
  | Success<S>

export type AsyncStatus<R, E, A> = Async<R, E, A>['type']

export type AsyncMap<R, E, A, U> = {
  [K in AsyncStatus<R, E, A>]: U extends { type: K } ? U : never
}

export type AsyncStatusMap<R, E, A> = AsyncMap<R, E, A, Async<R, E, A>>
export type AsyncPattern<T, R, E, A> = {
  [K in keyof AsyncStatusMap<R, E, A>]: (a: AsyncStatusMap<R, E, A>[K]) => T
}

export function match<R, E, A>(
  e: Async<R, E, A>,
): <T>(pattern: AsyncPattern<T, R, E, A>) => T {
  return <T>(pattern: AsyncPattern<T, R, E, A>) => pattern[e.type](e as any)
}
