/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import decksReducer from 'src/modules/decks/decks.reducer'

// As a basic setup, import your same slice reducers
import { loginReducer } from 'src/modules/login'
import { signupReducer } from 'src/modules/signup'
import { verificationReducer } from 'src/modules/verification'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
// interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
//   preloadedState?: PreloadedState<RootState>
//   store?: AppStore
// }

const reducers = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  verification: verificationReducer,
  decks: decksReducer,
})

const withRedux = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: reducers })
  return <Provider store={store}>{ui}</Provider>
}
const withRouter = (ui: React.ReactElement) => {
  const router = createMemoryRouter([{ element: ui, path: '/' }], {
    initialEntries: ['/'],
    initialIndex: 1,
  })

  return <RouterProvider router={router} />
}
export function renderWithProviders(ui: React.ReactElement) {
  // Return an object with the store and all of RTL's query functions
  return render(withRedux(withRouter(ui)))
}

export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 0))
