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
  }

  export type Initial = {
    __type__: 'INITIAL'
    id: string
    question: string
    answers: ReadonlyArray<NAnswers.Initial>
  }
  export function Initial(q: Partial<Initial>): Initial {
    return {
      __type__: 'INITIAL',
      id: _.uniqueId(),
      question: q.question || '',
      answers: q.answers || [NAnswers.Initial({})],
    }
  }

  export type Card = {
    __type__: 'FORMED'
    id: string
    deckId: string
    question: string
    answers: ReadonlyArray<NAnswers.Answer>
  }
}
