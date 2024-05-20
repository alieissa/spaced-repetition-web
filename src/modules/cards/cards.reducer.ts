/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { CardsAction } from './cards.actions'
import { NCards } from './cards.types'

const initialState: NCards.State = {
  check: {},
  checkStatus: {},
  createStatus: Untriggered(),
  loadStatus: {},
  loadedCards: {},
  updateStatus: {}
}

export default produce((draft: NCards.State, action: CardsAction) => {
  switch (action.type) {
    case 'CheckAnswer': {
      draft.checkStatus[action.id] = Loading(null)
      return
    }
    case 'AnswerChecked': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.checkStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.checkStatus[action.id] = Success(value)
          draft.check[action.id] = value
        },
      })
      return
    }
    case 'CreateCard': {
      draft.createStatus = Loading(null)
      return
    }
    case 'CardCreated': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.createStatus = Failure(value)
        },
        Right: ({ value }) => {
          draft.createStatus = Success(value)
          draft.loadedCards[value.id] = value
        },
      })
      return
    }
    case 'LoadCard': {
      draft.loadStatus[action.id] = Loading(null)
      return
    }
    case 'CardLoaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.loadStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.loadStatus[action.id] = Success(value)
          draft.loadedCards[action.id] = value
        },
      })
      return
    }
    case 'UpdateCard': {
      draft.updateStatus[action.id] = Loading(null)
      return
    }
    case 'CardUpdated': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.updateStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.updateStatus[action.id] = Success(value)
          draft.loadedCards[action.id] = value
        },
      })
      return
    }
  }
}, initialState)
