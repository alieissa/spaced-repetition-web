/** @format */

import _ from 'lodash';
import { Questions } from 'src/modules/questions';
import { Async } from 'src/utils/async';

export namespace NDecks {
  export type RequestError = { message: string; cause?: number }
  
  export type State = {
    decks: _.Dictionary<Deck>
    status: Async<null, RequestError, null>
    getStatus: _.Dictionary<Async<null, RequestError, Deck>>
    createStatus: Async<null, RequestError, null>
    updateStatus: _.Dictionary<Async<null, RequestError, null>>
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
  export type Initial = Omit<PostRequest, 'questions' | 'name'> & {
    readonly __key__: string
    readonly name?: string
    readonly questions: ReadonlyArray<Questions.Initial>
  }

  export function Initial(d: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
      name: d.name,
      description: d.description,
      questions: d.questions || [Questions.Initial({})],
    }
  }
  // TODO instead of having this. Simply a type guard and use that type guard
  // to detect the content of the request before sending to backend.
  export function toPostRequest(initial: Omit<Initial, '__key__'>): PostRequest {
    return {
      name: initial.name as string,
      description: initial.description,
      questions: _.map(initial.questions, (q) => Questions.toPostRequest(q)),
    }
  }

  export type Deck = Omit<PostRequest, 'questions'> & {
    id: string
    questions: ReadonlyArray<Questions.Question>
  }
}
