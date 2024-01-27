/** @format */

import _ from 'lodash';
import { Questions } from 'src/modules/questions';
import { Async } from 'src/utils/async';

export namespace NDecks {
  export type RequestError = { message: string; cause?: number }
  
  export type State = {
    decks: _.Dictionary<Deck>
    status: Async<null, RequestError, null>
    getStatus: _.Dictionary<Async<null, RequestError, null>>
    createStatus: Async<null, RequestError, null>
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

  /**
   * A new deck that is created in the UI but not saved.
   * a __key__ is needed to differentiate them when
   * being displayed in the UI
   */
  export type Initial = Omit<PostRequest, 'questions'> & {
    readonly __key__: string
    readonly questions: ReadonlyArray<Questions.Initial>
  }

  export function Initial(d: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
      name: d.name || 'new deck',
      description: d.description,
      questions: d.questions || [Questions.Initial({})],
    }
  }
  export function toPostRequest(initial: Initial): PostRequest {
    return {
      ..._.omit(initial, '__key__'),
      questions: _.map(initial.questions, (q) => Questions.toPostRequest(q)),
    }
  }

  export type Deck = Omit<PostRequest, 'questions'> & {
    id: string
    questions: ReadonlyArray<Questions.Question>
  }
}
