/** @format */

import React from 'react'
import { Link } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  ButtonProps,
  Container,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react'
import '../App.css'

export default function Decks() {
  return (
    <Container style={{ backgroundColor: 'ghostwhite', maxWidth: 1080 }}>
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton />
      </section>
      <NoDecks />
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
