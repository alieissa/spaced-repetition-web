/** @format */

import * as _ from 'lodash'
import { NAnswers } from 'src/modules/answers'
import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'

export namespace NCards {
  export type State = {
    checkStatus: Record<
      Card['id'],
      Async<null, RequestError, { distance: number; answer: any }>
    >
    check: Record<Card['id'], { distance: number; answer: NAnswers.Answer }>
    createStatus: Async<null, RequestError, NCards.Card>
    loadStatus: Record<Card['id'], Async<null, RequestError, NCards.Card>>
    loadedCards: Record<Card['id'], NCards.Card>
    updateStatus: Record<Card['id'], Async<null, RequestError, NCards.Card>>
  }

  export type Card = {
    id: string
    deckId: string
    question: string
    answers: NAnswers.Answer[]
  }

  export type Initial = {
    __type__: 'INITIAL'
    id: string
    deckId: string
    question: string
    answers: NAnswers.Initial[]
  }
  export function Initial(q: Partial<Initial>): Initial {
    return {
      __type__: 'INITIAL',
      id: _.uniqueId(),
      deckId: q.deckId || _.uniqueId(),
      question: q.question || '',
      answers: q.answers || [NAnswers.Initial({})],
    }
  }

  export type Formed = {
    __type__: 'FORMED'
    id: string
    deckId: string
    question: string
    answers: NAnswers.Answer
  }
}
