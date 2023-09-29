/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as decksReducer } from './modules/decks'
const reducers = combineReducers({
  decks: decksReducer,
})

export default configureStore({ reducer: reducers })
