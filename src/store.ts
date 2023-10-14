/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { loginReducer } from 'src/modules/login'
import { signupReducer } from 'src/modules/signup'
import { reducer as decksReducer } from './modules/decks'

const reducers = combineReducers({
  decks: decksReducer,
  login: loginReducer,
  signup: signupReducer
})

export default configureStore({ reducer: reducers })
