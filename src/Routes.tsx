/** @format */

import { Route, Routes } from 'react-router-dom'
import {
  DeckPage,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Login } from 'src/modules/login'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/decks" element={<DecksListPage />} />
      <Route path="/decks/new" element={<NewDeck />} />
      <Route path="/decks/:deckId" element={<DeckPage />} />
      <Route path="/decks/:deckId/exam" element={<DeckTestPage />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/" element={<DecksListPage />} />
    </Routes>
  )
}
