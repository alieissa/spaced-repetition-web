/** @format */

import { RequestError } from 'src/types'
import { Either } from 'src/utils/either'
import { NDecks } from './decks.types'

export type GetDeck = {
  type: 'GetDeck'
  id: NDecks.Deck['id']
}

export type DeckLoaded = {
  type: 'DeckLoaded'
  result: Either<RequestError, NDecks.Deck>
  id: NDecks.Deck['id']
}

export type GetDecks = {
  type: 'GetDecks'
}

export type DecksLoaded = {
  type: 'DecksLoaded'
  result: Either<RequestError, ReadonlyArray<NDecks.Deck>>
}

export type CreateDeck = {
  type: 'CreateDeck'
}

export type DeckCreated = {
  type: 'DeckCreated'
  result: Either<RequestError, NDecks.Deck>
}

export type UpdateDeck = {
  type: 'UpdateDeck'
  id: string
}

export type DeckUpdated = {
  type: 'DeckUpdated'
  id: string
  result: Either<RequestError, NDecks.Deck>
}

export type UploadDecks = {
  type: 'UploadDecks'
}

export type DecksUploaded = {
  type: 'DecksUploaded'
  result: Either<RequestError, null>
}

export type DownloadDecks = {
  type: 'DownloadDecks'
}

export type DecksDownloaded = {
  type: 'DecksDownloaded'
  result: Either<RequestError, string>
}

export type ResetUploadDecks = {
  type: 'ResetUploadDecks'
}

export type DeckReset = {
  type: 'DeckReset'
  id: string
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
