/** @format */

import { RequestError } from 'src/types'
import { Either } from 'src/utils/either'
import { NDecks } from './decks.types'

export type GetDeck = {
  readonly type: 'GetDeck'
  readonly id: NDecks.Deck['id']
}

export type DeckLoaded = {
  readonly type: 'DeckLoaded'
  readonly result: Either<RequestError, NDecks.Deck>
  readonly id: NDecks.Deck['id']
}

export type GetDecks = {
  readonly type: 'GetDecks'
}

export type DecksLoaded = {
  readonly type: 'DecksLoaded'
  readonly result: Either<RequestError, ReadonlyArray<NDecks.Deck>>
}

export type CreateDeck = {
  readonly type: 'CreateDeck'
}

export type DeckCreated = {
  readonly type: 'DeckCreated'
  readonly result: Either<RequestError, NDecks.Deck>
}

export type UpdateDeck = {
  readonly type: 'UpdateDeck'
  readonly id: string
}

export type DeckUpdated = {
  readonly type: 'DeckUpdated'
  readonly id: string
  readonly result: Either<RequestError, NDecks.Deck>
}

export type UploadDecks = {
  readonly type: 'UploadDecks'
}

export type DecksUploaded = {
  readonly type: 'DecksUploaded'
  readonly result: Either<RequestError, null>
}

export type DownloadDecks = {
  readonly type: 'DownloadDecks'
}

export type DecksDownloaded = {
  readonly type: 'DecksDownloaded'
  readonly result: Either<RequestError, string>
}

export type ResetUploadDecks = {
  readonly type: 'ResetUploadDecks'
}

export type DeckReset = {
  readonly type: 'DeckReset'
  readonly id: string
}

export type DecksAction =
  | GetDeck
  | DeckLoaded
  | GetDecks
  | DecksLoaded
  | CreateDeck
  | DeckCreated
  | UploadDecks
  | DecksUploaded
  | DownloadDecks
  | DecksDownloaded
  | ResetUploadDecks
  | UpdateDeck
  | DeckUpdated
  | DeckReset
