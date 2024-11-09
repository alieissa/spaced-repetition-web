/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from 'src/modules/auth'

const reducers = combineReducers({
  auth: authReducer,
})

export default configureStore({ reducer: reducers })
