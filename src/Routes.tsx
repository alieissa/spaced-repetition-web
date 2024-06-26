/** @format */

import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from 'src/modules/auth'
import {
  DeckDetails,
  DeckEdit,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'
import NotFound from './NotFound'
import SPSidebar from './modules/Sidebar'
import ForgotPassword from './modules/auth/ForgotPassword'
import { CardCreateModal, CardDetailsModal } from './modules/cards'

const withSidebar = (Component: JSX.Element) => {
  return (
    <div style={{ height: '100vh' }}>
      <SPSidebar />
      <div className="h-full main">{Component}</div>
    </div>
  )
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/decks" element={withSidebar(<DecksListPage />)}>
        <Route path="new" element={<NewDeck />} />
        <Route path=":deckId/edit" element={<DeckEdit />} />
        <Route path=":deckId/test" element={<DeckTestPage />} />
        <Route path=":deckId" element={<DeckDetails />}>
          <Route path="cards/new" element={<CardCreateModal />} />
          <Route path="cards/:cardId" element={<CardDetailsModal />} />
          <Route path="*" element={<NotFound message="Deck not found" />} />
        </Route>
      </Route>
      <Route path="/verify" element={<Verification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Navigate replace to="/decks" />} />
      <Route path="*" element={<NotFound message="Page Not found" />} />
    </Routes>
  )
}
