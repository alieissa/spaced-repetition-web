/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Async, Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { DecksAction } from './decks.actions'
import { Decks } from './decks.types'

type DecksState = {
  decks: ReadonlyArray<Decks.Deck>
  status: Async<null, Error, null>
}
const initialState: Decks.State = {
  decks: [],
  status: Untriggered(),
}

export default produce((draft: Decks.State, action: DecksAction) => {
  switch (action.type) {
    case 'GetDecks':
      draft.status = Loading(null)
      return
    case 'DecksLoaded':
      either.match(action.result)({
        Left: ({ value }) => {
          draft.status = Failure(value)
        },
        Right: ({ value }) => {
          draft.status = Success(null)
          draft.decks = value
        },
      })
      return
  }
}, initialState)
