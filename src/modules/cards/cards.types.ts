/** @format */

import * as _ from 'lodash'
import { Answers } from 'src/modules/answers'
export namespace NCards {
  export type PostRequest =  {
    readonly question: string
    readonly answers: ReadonlyArray<Answers.PostRequest>
  }
  export function PostRequest(q: PostRequest): PostRequest {
    return {
      question: q.question || 'new question',
      answers: q.answers,
    }
  }

  export type Initial = Omit<PostRequest, 'answers'> & {
    readonly __key__: string
    readonly answers: ReadonlyArray<Answers.Initial>
  }
  export function Initial(q: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
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
