/** @format */

import { Route, Routes } from 'react-router-dom'
import { Login, Logout } from 'src/modules/auth'
import {
  DeckPage,
  DeckTestPage,
  DecksListPage,
  NewDeck,
} from 'src/modules/decks'
import { Signup } from 'src/modules/signup'
import { Verification } from 'src/modules/verification'
import SPSidebar from './modules/Sidebar'

const withSidebar = (Component: JSX.Element) => {
  return (
    <div style={{ height: '100vh' }}>
      <SPSidebar />
      <div className="h-full" style={{ paddingLeft: 86 }}>
        {Component}
      </div>
    </div>
  )
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/decks" element={withSidebar(<DecksListPage />)}>
        <Route path="new" element={<NewDeck />} />
        <Route path=":deckId" element={<DeckPage />} />
        <Route path=":deckId/test" element={<DeckTestPage />} />
      </Route>
      <Route path="/verify" element={<Verification />} />
      <Route path="/" element={withSidebar(<DecksListPage />)} />
    </Routes>
  )
}
