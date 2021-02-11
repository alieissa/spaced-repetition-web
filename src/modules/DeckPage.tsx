/** @format */

import _ from 'lodash'
import React, { useState } from 'react'
import { RouteProps } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Container, Header, List, Segment } from 'semantic-ui-react'
import { styles } from 'src/styles'
import { Question } from '.'
import '../App.css'
import { IconButton, NewQuestion } from '../components'

export default function DeckPage(props: RouteProps) {
  const [NewQuestions, setNewQuestions] = useState(0)

  return (
    <Container className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
      </section>
      <List doubling stackable>
        {_.map(_.range(0, 3), (i) => {
          return (
            <List.Item>
              <Question />
            </List.Item>
          )
        })}
        {_.map(_.range(0, NewQuestions), (i) => {
          return (
            <List.Item key={i} width={16}>
              <NewQuestion></NewQuestion>
            </List.Item>
          )
        })}
      </List>

      <Segment basic style={styles.p0} className="justify-flex-end">
        <IconButton
          icon
          button
          color="green"
          name="plus"
          onClick={() => setNewQuestions(NewQuestions + 1)}
        />
      </Segment>
    </Container>
  )
}
