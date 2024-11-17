/** @format */

import { PropsWithChildren } from 'react'
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
import useAppContext from './app.hooks'
import SPSidebar from './modules/Sidebar'

const withSidebar = (Component: JSX.Element) => {
  return (
    <div style={{ height: '100vh' }}>
      <SPSidebar />
      <div className="h-full main">{Component}</div>
    </div>
  )
}

const AuthRoute = ({ children }: PropsWithChildren) => {
  const { token } = useAppContext()
  console.log('tokens', token)
  if (!token) {
    return <Login />
  }

  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
      <Route
        path="/decks"
        element={<AuthRoute>{withSidebar(<DecksListPage />)}</AuthRoute>}
      >
        <Route
          path="new"
          element={
            <AuthRoute>
              <NewDeck />
            </AuthRoute>
          }
        />
        <Route
          path=":deckId/edit"
          element={
            <AuthRoute>
              <DeckEdit />
            </AuthRoute>
          }
        />
        <Route
          path=":deckId/test"
          element={
            <AuthRoute>
              <DeckTestPage />
            </AuthRoute>
          }
        />
      </Route>
      <Route path="/verify" element={<Verification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <AuthRoute>
            <Navigate replace to="/decks" />
          </AuthRoute>
        }
      />
      <Route path="*" element={withSidebar(<NotFound />)} />
    </Routes>
  )
}
