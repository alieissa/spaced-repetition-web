/** @format */

import { Route, Routes } from 'react-router-dom'
import { Login, Logout } from 'src/modules/auth'
import {
  DeckDetails,
  DeckPage,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'
import { CardDetailsModal } from './modules/cards'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/decks" element={<DecksListPage />} />
      <Route path="/decks/new" element={<NewDeck />} />
      <Route path="/decks/:deckId/edit" element={<DeckPage />} />
      <Route path="/decks/:deckId" element={<DeckDetails />}>
        <Route path="cards/:cardId" element={<CardDetailsModal />} />
      </Route>
      <Route path="/decks/:deckId/test" element={<DeckTestPage />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/" element={<DecksListPage />} />
    </Routes>
  )
}
