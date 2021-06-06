/** @format */

import { Answers } from '../answers'

export namespace Questions {
  export type PostRequest = Settings & {
    readonly content: string
    readonly answers: ReadonlyArray<Answers.PostRequest>
  }
  export function PostRequest(q: Partial<PostRequest>): PostRequest {
    return {
      easiness: 1,
      quality: 1,
      interval: 1,
      content: q.content || 'new question',
      answers: q.answers || [],
    }
  }

  export type Question = PostRequest & {
    readonly id: string
    readonly answers: ReadonlyArray<Answers.Answer>
  }
}
