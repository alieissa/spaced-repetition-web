/** @format */

import { Dispatch } from 'react'
import { Either, Left, Right } from 'src/utils/either'

export type GetDecks = {
  readonly type: 'GetDecks'
}

export type DecksLoaded = {
  readonly type: 'DecksLoaded'
  readonly result: Either<Error, ReadonlyArray<Deck>>
}

export type DecksAction = GetDecks | DecksLoaded

// TODO Add http response validator and body validators
export function getDecks(dispatch: Dispatch<GetDecks | DecksLoaded>) {
  dispatch({
    type: 'GetDecks',
  })
  // TODO Get From env variable
  fetch('http://localhost:3000/decks', { method: 'GET' })
    .then((r) => r.json())
    .then((data) => Right(data))
    .catch((error) => Left(error))
    .then((result) =>
      dispatch({
        type: 'DecksLoaded',
        result,
      }),
    )
}
