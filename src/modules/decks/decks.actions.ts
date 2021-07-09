/** @format */

import { Either } from 'src/utils/either'
import { Decks } from './decks.types'

export type GetDeck = {
  readonly type: 'GetDeck'
  readonly id: Decks.Deck['id']
}

export type DeckLoaded = {
  readonly type: 'DeckLoaded'
  readonly result: Either<Error, Decks.Deck>
  readonly id: Decks.Deck['id']
}

export type GetDecks = {
  readonly type: 'GetDecks'
}

export type DecksLoaded = {
  readonly type: 'DecksLoaded'
  readonly result: Either<Error, ReadonlyArray<Decks.Deck>>
}

export type CreateDeck = {
  readonly type: 'CreateDeck'
}

export type DeckCreated = {
  readonly type: 'DeckCreated'
  readonly result: Either<Error, Decks.Deck>
}

export type DecksAction =
  | GetDeck
  | DeckLoaded
  | GetDecks
  | DecksLoaded
  | CreateDeck
  | DeckCreated
