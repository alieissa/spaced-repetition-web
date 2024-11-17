/** @format */

import { Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPassword, Login, ResetPassword } from 'src/modules/auth'
import {
  DeckEdit,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'
import NotFound from './NotFound'
import SPSidebar from './modules/Sidebar'

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
      </Route>
      <Route path="/verify" element={<Verification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Navigate replace to="/decks" />} />
      <Route path="*" element={withSidebar(<NotFound />)} />
    </Routes>
  )
}
