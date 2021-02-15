/** @format */

import * as _ from 'lodash'
import React from 'react'
import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
} from 'react-router-dom'
import { DeckPage, DecksListPage, NewDeck } from './modules'

interface Props {
  readonly areValidParameters: (params: object) => boolean
}
function ParametrisedRoute(props: Props & RouteProps) {
  const params = useParams()
  return props.areValidParameters(params) ? (
    <Route {..._.omit(props, 'areValidParameter')}></Route>
  ) : (
    <Redirect to="/not-found" />
  )
}
export default function Routes() {
  return (
    <Switch>
      <Route
        exact
        path="/decks/new"
        render={(props: RouteProps) => <NewDeck {...props} />}
      />
      <ParametrisedRoute
        path="/decks/:deckId"
        areValidParameters={(params: RouteProps) => true}
        render={(props: RouteProps) => <DeckPage {...props} />}
      />
      <Route path="/">
        <DecksListPage />
      </Route>
    </Switch>
  )
}
