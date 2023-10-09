/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { signupReducer } from 'src/modules/signup'
import { reducer as decksReducer } from './modules/decks'

const reducers = combineReducers({
  decks: decksReducer,
  signup: signupReducer
})

export default configureStore({ reducer: reducers })
