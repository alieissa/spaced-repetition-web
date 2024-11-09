/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from 'src/modules/auth'
import { signupReducer } from 'src/modules/signup'
import { verificationReducer } from './modules/verification'

const reducers = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  verification: verificationReducer
})

export default configureStore({ reducer: reducers })
