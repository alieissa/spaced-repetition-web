/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from 'src/modules/auth'
import { verificationReducer } from './modules/verification'

const reducers = combineReducers({
  auth: authReducer,
  verification: verificationReducer
})

export default configureStore({ reducer: reducers })
