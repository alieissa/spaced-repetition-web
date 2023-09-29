/** @format */

import * as _ from 'lodash'
import {
  Navigate,
  Route,
  RouteProps,
  Routes,
  useParams,
} from 'react-router-dom'
import { DeckPage, DeckTestPage, DecksListPage, NewDeck } from './modules/decks'

const ProtectedRoute = ({ Component, ...args }: RouteProps) => (
  <Route Component={Component} {...args} />
)
export default function AppRoutes() {
  return (
    <Routes>
      <ProtectedRoute path="/decks/new" Component={NewDeck} />
      <ProtectedRoute
        path="/decks/:deckId"
        Component={function Test(props: RouteProps) {
          const params = useParams()
          const deckId = _.get(params, 'deckId')
          return deckId ? (
            <DeckPage {...props} deckId={deckId} />
          ) : (
            <Navigate to="not-found" />
          )
        }}
      />
      <ProtectedRoute path="/decks/:deckId/exam" Component={DeckTestPage} />
      <ProtectedRoute Component={DecksListPage} path="/" />
    </Routes>
  )
}
