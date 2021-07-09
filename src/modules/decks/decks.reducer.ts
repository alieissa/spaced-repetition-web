/** @format */

import produce from 'immer'
import * as _ from 'lodash'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { DecksAction } from './decks.actions'
import { Decks } from './decks.types'

const initialState: Decks.State = {
  decks: {},
  status: Untriggered(),
  getStatus: {},
  createStatus: Untriggered(),
}

export default produce((draft: Decks.State, action: DecksAction) => {
  switch (action.type) {
    case 'GetDeck': {
      draft.getStatus[action.id] = Loading(null)
      return
    }
    case 'DeckLoaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.getStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.getStatus[value.id] = Success(null)
          draft.decks[value.id] = value
        },
      })
      return
    }
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
          draft.decks = _.keyBy(value, 'id')
        },
      })
      return
    case 'CreateDeck': {
      draft.createStatus = Loading(null)
      return
    }
    case 'DeckCreated': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.createStatus = Failure(value)
        },
        Right: ({ value }) => {
          draft.createStatus = Success(null)
          draft.decks[value.id] = value
        },
      })
      return
    }
  }
}, initialState)
