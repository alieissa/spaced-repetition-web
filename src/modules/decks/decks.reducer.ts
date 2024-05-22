/** @format */

import produce from 'immer'
import * as _ from 'lodash'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { CardsAction } from '../cards/cards.actions'
import { DecksAction } from './decks.actions'
import { NDecks } from './decks.types'

const initialState: NDecks.State = {
  decks: {},
  status: Untriggered(),
  loadStatus: {},
  createStatus: Untriggered(),
  updateStatus: {},
  deleteStatus: {},
  uploadDecksStatus: Untriggered(),
  downloadDecksUrl: null,
  downloadDecksStatus: Untriggered(),
}

export default produce((draft: NDecks.State, action: DecksAction | CardsAction) => {
  switch (action.type) {
    case 'LoadDeck': {
      draft.loadStatus[action.id] = Loading(null)
      return
    }
    case 'DeckLoaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.loadStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.loadStatus[action.id] = Success(value)
          draft.decks[action.id] = value
        },
      })
      return
    }
    case 'LoadDecks':
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
          value.forEach((deck) => {
            draft.loadStatus[deck.id] = Success(deck)
          })
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
    case 'DeleteDeck': {
      draft.deleteStatus[action.id] = Loading(null)
      return
    }
    case 'DeckDeleted': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.deleteStatus[action.id] = Failure(value)
        },
        Right: () => {
          draft.deleteStatus[action.id] = Success(null)
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
    case 'DownloadDecks': {
      draft.downloadDecksStatus = Loading(null)
      return
    }
    case 'DecksDownloaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.downloadDecksStatus = Failure(value)
        },
        Right: ({ value }) => {
          draft.downloadDecksUrl = value
          draft.downloadDecksStatus = Success(null)
        },
      })
      return
    }
    case 'ResetUploadDecks': {
      draft.uploadDecksStatus = Untriggered()
      return
    }
    case 'DeckReset': {
      draft.updateStatus[action.id] = Untriggered()
      draft.loadStatus[action.id] = Untriggered()
      return
    }
  }
}, initialState)
