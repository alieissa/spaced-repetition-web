/** @format */

import { Questions } from 'src/modules/questions'
import { Async } from 'src/utils/async'

export namespace Decks {
  export type State = {
    decks: ReadonlyArray<Deck>
    status: Async<null, Error, null>
  }

  export type PostRequest = {
    readonly name: string
    readonly description?: string
    readonly questions: ReadonlyArray<Questions.PostRequest>
  }

  export function PostRequest(d: Partial<PostRequest>): PostRequest {
    return {
      name: d.name || 'new deck',
      description: d.description,
      questions: d.questions || [Questions.PostRequest({})],
    }
  }

  export type Deck = PostRequest & { id: string }
}
