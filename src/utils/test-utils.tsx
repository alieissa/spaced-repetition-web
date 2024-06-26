/** @format */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import decksReducer from 'src/modules/decks/decks.reducer'

// As a basic setup, import your same slice reducers
import { authReducer } from 'src/modules/auth'
import { cardsReducer } from 'src/modules/cards'
import { signupReducer } from 'src/modules/signup'
import { verificationReducer } from 'src/modules/verification'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
// interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
//   preloadedState?: PreloadedState<RootState>
//   store?: AppStore
// }

const reducers = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  verification: verificationReducer,
  decks: decksReducer,
  cards: cardsReducer,
})

export const withRedux = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: reducers })
  return <Provider store={store}>{ui}</Provider>
}
const withRouter = (
  ui: React.ReactElement,
  routeOptions: { path: string; initialEntries: string[] } = {
    path: '/',
    initialEntries: ['/'],
  },
) => {
  const routes = [{ element: ui, path: routeOptions.path }]
  const router = createMemoryRouter(routes, {
    initialEntries: routeOptions.initialEntries,
  })
  return <RouterProvider router={router} />
}
export function renderWithProviders(
  ui: React.ReactElement,
  routeOptions: { path: string; initialEntries: string[] } = {
    path: '/',
    initialEntries: ['/'],
  },
) {
  // Return an object with the store and all of RTL's query functions
  return render(withRedux(withRouter(ui, routeOptions)))
}

// We specify the container in which the component is rendered as the body
// as a workaround for the modal not being mounted by react-testing library.
// Without this workaround, the snapshots are empty fragments.
// See https://github.com/testing-library/react-testing-library/issues/62
export function renderModalWithProviders(
  ui: React.ReactElement,
  routeOptions: { path: string; initialEntries: string[] } = {
    path: '/',
    initialEntries: ['/'],
  },
) {
  return render(withRedux(withRouter(ui, routeOptions)), {
    container: document.body,
  })
}

export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 0))
