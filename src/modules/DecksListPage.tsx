/** @format */

import * as _ from 'lodash'
import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header } from 'semantic-ui-react'
import '../App.css'
import { CreateButton } from '../components'
import Deck from './Deck'

export default function Decks() {
  return (
    <Container className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton createLink="/decks/new" />
      </section>
      <Grid doubling stackable>
        {_.map(_.range(0, 3), (i) => (
          <Grid.Column width={4}>
            <Deck id={`${i}`} key={i} className="h-full" />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}
