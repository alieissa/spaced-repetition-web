/** @format */

import * as _ from 'lodash'
import {
  Navigate,
  Route,
  RouteProps,
  Routes,
  useParams,
} from 'react-router-dom'
import {
  DeckPage,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Login } from 'src/modules/login'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'

function Test(props: RouteProps) {
  const params = useParams()
  const deckId = _.get(params, 'deckId')
  return deckId ? (
    <DeckPage {...props} deckId={deckId} />
  ) : (
    <Navigate to="not-found" />
  )
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/decks" element={<DecksListPage />} />
      <Route path="/decks/new" element={<NewDeck />} />
      <Route path="/decks/:deckId" element={<Test />} />
      <Route path="/decks/:deckId/exam" element={<DeckTestPage />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/" element={<DecksListPage />} />
    </Routes>
  )
}
