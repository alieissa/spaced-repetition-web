/** @format */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Decks, NewDeck } from './decks'

export default function Routes() {
  return (
    <Switch>
      <Route path="/decks/new">
        <NewDeck />
      </Route>
      <Route path="/">
        <Decks />
      </Route>
    </Switch>
  )
}
