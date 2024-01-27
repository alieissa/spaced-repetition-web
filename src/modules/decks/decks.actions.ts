/** @format */

import { Either } from 'src/utils/either'
import { NDecks } from './decks.types'

export type GetDeck = {
  readonly type: 'GetDeck'
  readonly id: NDecks.Deck['id']
}

export type DeckLoaded = {
  readonly type: 'DeckLoaded'
  readonly result: Either<NDecks.RequestError, NDecks.Deck>
  readonly id: NDecks.Deck['id']
}

export type GetDecks = {
  readonly type: 'GetDecks'
}

export type DecksLoaded = {
  readonly type: 'DecksLoaded'
  readonly result: Either<NDecks.RequestError, ReadonlyArray<NDecks.Deck>>
}

export type CreateDeck = {
  readonly type: 'CreateDeck'
}

export type DeckCreated = {
  readonly type: 'DeckCreated'
  readonly result: Either<NDecks.RequestError, NDecks.Deck>
}

export type DecksAction =
  | GetDeck
  | DeckLoaded
  | GetDecks
  | DecksLoaded
  | CreateDeck
  | DeckCreated
