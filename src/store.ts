/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from 'src/modules/auth'
import { signupReducer } from 'src/modules/signup'
import { reducer as decksReducer } from './modules/decks'
import { verificationReducer } from './modules/verification'

const reducers = combineReducers({
  decks: decksReducer,
  auth: authReducer,
  signup: signupReducer,
  verification: verificationReducer
})

export default configureStore({ reducer: reducers })
