/** @format */

import produce from 'immer'
import { either } from 'src/utils'
import { Failure, Loading, Success } from 'src/utils/async'
import { CardsAction } from './cards.actions'
import { NCards } from './cards.types'

const initialState: NCards.State = {
  check: {},
  checkStatus: {}
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
  }
}, initialState)
