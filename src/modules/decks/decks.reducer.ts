/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Async, Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { DecksAction } from './decks.actions'

type DecksState = {
  decks: ReadonlyArray<Deck>
  status: Async<null, Error, null>
}
const initialState: DecksState = {
  decks: [],
  status: Untriggered(),
}

export default produce((draft: DecksState, action: DecksAction) => {
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
