/** @format */

import * as _ from 'lodash'
import { Answers } from 'src/modules/answers'
import { Settings } from 'src/types'
export namespace NCards {
  export type PostRequest = Settings & {
    readonly question: string
    readonly answers: ReadonlyArray<Answers.PostRequest>
  }
  export function PostRequest(q: Partial<PostRequest>): PostRequest {
    return {
      easiness: 1,
      quality: 1,
      interval: 1,
      question: q.question || 'new question',
      answers: q.answers || [Answers.PostRequest({})],
    }
  }

  export type Initial = Omit<PostRequest, 'answers'> & {
    readonly __key__: string
    readonly answers: ReadonlyArray<Answers.Initial>
  }
  export function Initial(q: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
      easiness: 1,
      quality: 1,
      interval: 1,
      question: q.question || '',
      answers: q.answers || [Answers.Initial({})],
    }
  }
  export function toPostRequest(initial: Initial): PostRequest {
    return {
      ..._.omit(initial, '__key__'),
      answers: _.map(initial.answers, (a) => Answers.toPostRequest(a)),
    }
  }

  export type Card = Omit<PostRequest, 'answers'> & {
    readonly id: string
    readonly question: string
    readonly answers: ReadonlyArray<Answers.Answer>
  }
}
