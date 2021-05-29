/** @format */

import { combineReducers, createStore } from 'redux'
import { reducer as decksReducer } from './modules/decks'
const reducers = combineReducers({
  decks: decksReducer,
})

export default createStore(reducers)
