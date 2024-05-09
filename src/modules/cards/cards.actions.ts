/** @format */

import { RequestError } from 'src/types'
import { Either } from 'src/utils/either'
import { NCards } from './cards.types'

export type CheckAnswer = {
  type: 'CheckAnswer'
  id: NCards.Card['id']
}

export type AnswerChecked = {
  type: 'AnswerChecked'
  result: Either<RequestError, NCards.State['check'][string]>
  id: NCards.Card['id']
}

export type UpdateQuality = {
  type: 'UpdateCardQuality'
  id: NCards.Card['id']
}

export type QualityUpdated = {
  type: 'QualityUpdated'
  result: Either<RequestError, NCards.State['check'][string]>
  id: NCards.Card['id']
}

export type CreateCard = {
  type: 'CreateCard'
}

export type CardCreated = {
  type: 'CardCreated'
  result: Either<RequestError, NCards.Card>
}

export type CardsAction =
  | CheckAnswer
  | AnswerChecked
  | UpdateQuality
  | QualityUpdated
  | CreateCard
  | CardCreated
