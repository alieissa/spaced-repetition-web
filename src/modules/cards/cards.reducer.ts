/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success, Untriggered } from 'src/utils/async'
import { CardsAction } from './cards.actions'
import { NCards } from './cards.types'

const initialState: NCards.State = {
  check: {},
  checkStatus: {},
  createCardStatus: Untriggered(),
  loadCardStatus: {},
  loadedCards: {},
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
      draft.createCardStatus = Loading(null)
      return
    }
    case 'CardCreated': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.createCardStatus = Failure(value)
        },
        Right: ({ value }) => {
          draft.createCardStatus = Success(value)
        },
      })
      return
    }
    case 'LoadCard': {
      draft.loadCardStatus[action.id] = Loading(null)
      return
    }
    case 'CardLoaded': {
      either.match(action.result)({
        Left: ({ value }) => {
          draft.loadCardStatus[action.id] = Failure(value)
        },
        Right: ({ value }) => {
          draft.loadCardStatus[action.id] = Success(value)
          draft.loadedCards[action.id] = value
        }
      })
      return
    }
  }
}, initialState)
