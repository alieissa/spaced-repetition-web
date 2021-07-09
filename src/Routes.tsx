/** @format */

import { withAuthenticationRequired } from '@auth0/auth0-react'
import * as _ from 'lodash'
import React from 'react'
import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
} from 'react-router-dom'
import {
  DeckPage,
  DecksListPage,
  DeckTestPage,
  NewDeck,
} from 'src/modules/decks'

type ProtectedRouteProps = Omit<RouteProps, 'component'> &
  Required<Pick<RouteProps, 'component'>>
const ProtectedRoute = ({ component, ...args }: ProtectedRouteProps) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
)
export default function Routes() {
  return (
    <Switch>
      <ProtectedRoute exact path="/decks/new" component={NewDeck} />
      <ProtectedRoute
        exact
        path="/decks/:deckId"
        component={function Test(props: RouteProps) {
          const params = useParams()
          const deckId = _.get(params, 'deckId')
          return deckId ? (
            <DeckPage {...props} deckId={deckId} />
          ) : (
            <Redirect to="not-found" />
          )
        }}
      />
      <ProtectedRoute
        exact
        path="/decks/:deckId/exam"
        component={DeckTestPage}
      />
      <ProtectedRoute component={DecksListPage} path="/" />
    </Switch>
  )
}
