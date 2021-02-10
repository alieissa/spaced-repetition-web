/** @format */

import React from 'react'
import { Link } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  ButtonProps,
  Container,
  Grid,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react'
import { NewCard, QuestionCard } from 'src/cards'
import '../App.css'
import Deck from './Deck'

export default function Decks() {
  return (
    <Container className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton />
      </section>
      <Grid doubling stackable>
        <Grid.Column width={4}>
          <Deck className="h-full" />
        </Grid.Column>
        <Grid.Column width={4}>
          <Deck className="h-full" />
        </Grid.Column>
        <Grid.Column width={4}>
          <Deck className="h-full" />
        </Grid.Column>
        <Grid.Column width={5}>
          <QuestionCard className="h-full" />
        </Grid.Column>
        <Grid.Column width={10}>
          <NewCard />
        </Grid.Column>
      </Grid>
    </Container>
  )
}

function NoDecks() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="clone outline" />
        Add New Deck
      </Header>
      <CreateButton />
    </Segment>
  )
}

function CreateButton(props: ButtonProps) {
  return (
    <Link to="/decks/new">
      <Button color="green" {...props}>
        Create
      </Button>
    </Link>
  )
}
