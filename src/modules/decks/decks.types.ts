/** @format */

import _ from 'lodash'
import { NCards } from 'src/modules/cards'
import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'

export namespace NDecks {
  export type State = {
    decks: _.Dictionary<Deck>
    status: Async<null, RequestError, null>
    loadStatus: _.Dictionary<Async<null, RequestError, Deck>>
    createStatus: Async<null, RequestError, null>
    updateStatus: _.Dictionary<Async<null, RequestError, null>>
    deleteStatus: _.Dictionary<Async<null, RequestError, null>>
    uploadDecksStatus: Async<null, RequestError, null>
    downloadDecksUrl: string | null
    downloadDecksStatus: Async<null, RequestError, null>
  }

  export type Deck = {
    id: string
    name: string
    description?: string
    cards: NCards.Card[]
  }

  export type Initial = {
    __type__: 'INITIAL'
    id: string
    name: string
    description?: string
    cards: NCards.Initial[]
  }

  export function Initial(d: Partial<Initial>): Initial {
    return {
      __type__: 'INITIAL',
      id: _.uniqueId(),
      name: d.name || '',
      description: d.description,
      cards: d.cards || [NCards.Initial({})],
    }
  }

  export type Formed = {
    __type__: 'FORMED'
    id: string
    name: string
    description?: string
    cards: NCards.Card[]
  }
}
