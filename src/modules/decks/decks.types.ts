/** @format */

import _ from 'lodash';
import { NCards } from 'src/modules/cards';
import { RequestError } from 'src/types';
import { Async } from 'src/utils/async';

export namespace NDecks {
  export type State = {
    decks: _.Dictionary<Deck>
    status: Async<null, RequestError, null>
    getStatus: _.Dictionary<Async<null, RequestError, Deck>>
    createStatus: Async<null, RequestError, null>
    updateStatus: _.Dictionary<Async<null, RequestError, null>>
    uploadDecksStatus: Async<null, RequestError, null>
  }

  export type PostRequest = {
    readonly name: string
    readonly description?: string
    readonly cards: ReadonlyArray<NCards.PostRequest>
  }
  export function PostRequest(d: PostRequest): PostRequest {
    return {
      name: d.name,
      description: d.description,
      cards: d.cards,
    }
  }

  /**
   * A new deck that is created in the UI but not saved.
   * a __key__ is needed to differentiate them when
   * being displayed in the UI
   */
  export type Initial = Omit<PostRequest, 'cards' | 'name'> & {
    readonly __key__: string
    readonly name?: string
    readonly cards: ReadonlyArray<NCards.Initial>
  }

  export function Initial(d: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
      name: d.name,
      description: d.description,
      cards: d.cards || [NCards.Initial({})],
    }
  }
  // TODO instead of having this. Simply a type guard and use that type guard
  // to detect the content of the request before sending to backend.
  export function toPostRequest(
    initial: Omit<Initial, '__key__'>,
  ): PostRequest {
    return {
      name: initial.name as string,
      description: initial.description,
      cards: _.map(initial.cards, (q) => NCards.toPostRequest(q)),
    }
  }

  export type Deck = Omit<PostRequest, 'cards'> & {
    id: string
    cards: ReadonlyArray<NCards.Card>
  }
}
