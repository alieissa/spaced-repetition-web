/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import { RouteProps } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Container, Header, Icon, List } from 'semantic-ui-react'
import { styles } from 'src/styles'
import '../App.css'
import { Settings } from '../components'
import TestQuestion from './TestQuestion'

/**
 * Displays the deck information and a list of cards (questions) that belong to deck. User can
 * perform CRUD operation on individual cards (questions) and/or on entire deck
 */
export default function DeckTestPage(__: RouteProps) {
  //   const [NewQuestions, setNewQuestions] = useState(0)
  const [editing, setEditing] = useState(false)

  return (
    <Container className="w-max-xl">
      <Card fluid style={styles.boxShadowNone}>
        <Card.Content
          className="justify-space-between relative"
          style={{ ...styles['px-0'], ...styles['pt-0'] }}
        >
          <DeckInfo
            name="Deck 2"
            description="Dummy deck description"
            onEdit={() => setEditing(true)}
            onSubmitSettings={() => console.log('submit settings')}
          />
        </Card.Content>
      </Card>
      <List>
        {_.map(_.range(0, 3), (i) => {
          return (
            <List.Item key={i}>
              <TestQuestion />
            </List.Item>
          )
        })}
      </List>
    </Container>
  )
}

// TODO Move DeckInfo component to components dir. It is used in two places
interface DeckInfoProps {
  readonly onEdit: VoidFunction
  readonly onSubmitSettings: VoidFunction
}
/**
 * Displays the name and description of a deck. User can delete deck, open deck settings form
 * and open form to edit name and description of a deck
 */
function DeckInfo(props: WithDeck<DeckInfoProps, 'name' | 'description'>) {
  const [open, setOpen] = useState(false)

  return (
    <Card fluid style={styles.boxShadowNone}>
      <Card.Content
        className="justify-space-between"
        style={{ ...styles['pl-0'], ...styles['pt-0'] }}
      >
        <span className="flex-1" style={{ width: '100%' }}>
          <Header as="h2">{props.name}</Header>
          <Card.Description>{props.description}</Card.Description>
        </span>
        <span>
          <Button
            circular
            style={styles.bgWhite}
            icon={<Icon name="pencil" />}
            onClick={() => props.onEdit()}
          />
          <Button style={styles.bgWhite} icon={<Icon name="x" color="red" />} />
          <Settings
            id="dummyId2"
            open={open}
            easiness={1}
            quality={1}
            interval={1}
            trigger={
              <Button
                style={styles.bgWhite}
                icon={<Icon name="setting" />}
                onClick={() => setOpen(true)}
              />
            }
            onCancel={() => setOpen(false)}
            onSave={props.onSubmitSettings}
          />
        </span>
      </Card.Content>
    </Card>
  )
}
