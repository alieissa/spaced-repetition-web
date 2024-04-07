/** @format */

import { RequestError } from 'src/types'
import { Either } from 'src/utils/either'
import { NCards } from './cards.types'

export type CheckAnswer = {
  readonly type: 'CheckAnswer'
  readonly id: NCards.Card['id']
}

export type AnswerChecked = {
  readonly type: 'AnswerChecked'
  readonly result: Either<RequestError, NCards.State['check'][string]>
  readonly id: NCards.Card['id']
}

export type UpdateQuality = {
  readonly type: 'UpdateCardQuality',
  readonly id: NCards.Card['id'],
}

export type QualityUpdated = {
  readonly type: 'QualityUpdated'
  readonly result: Either<RequestError, NCards.State['check'][string]>
  readonly id: NCards.Card['id']
}

export type CardsAction =
  | CheckAnswer
  | AnswerChecked
  | UpdateQuality
  | QualityUpdated
