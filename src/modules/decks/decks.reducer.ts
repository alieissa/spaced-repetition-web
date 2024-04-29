/** @format */

import produce from 'immer'
import * as _ from 'lodash'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { DecksAction } from './decks.actions'
import { NDecks } from './decks.types'

const initialState: NDecks.State = {
  decks: {},
  status: Untriggered(),
  getStatus: {},
  createStatus: Untriggered(),
  updateStatus: {},
  uploadDecksStatus: Untriggered()
}

export default produce((draft: NDecks.State, action: DecksAction) => {
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
          draft.getStatus[action.id] = Success(value)
          draft.decks[action.id] = value
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
          draft.decks = _.isEmpty(value) ? {} : _.keyBy(value, 'id')
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
    case 'UpdateDeck': {
      draft.updateStatus[action.id] = Loading(null)
      return
    }
    case 'DeckUpdated': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.updateStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.updateStatus[action.id] = Success(null)
          draft.decks[action.id] = value
        },
      })
      return
    }
    case 'UploadDecks': {
      draft.uploadDecksStatus = Loading(null)
      return
    }
    case 'DecksUploaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.uploadDecksStatus = Failure(value)
        },
        Right: () => {
          draft.uploadDecksStatus = Success(null)
        },
      })
      return
    }
    case 'DeckReset': {
      draft.updateStatus[action.id] = Untriggered()
      return
    }
  }
}, initialState)
