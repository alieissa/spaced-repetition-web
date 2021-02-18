/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import { RouteProps } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Icon, Input, List, Segment } from 'semantic-ui-react'
import { QuestionForm, Settings } from 'src/components'
import '../App.css'
import { styles } from '../styles'
import { createAnswer } from './helpers'

export default function NewDeck(props: RouteProps) {
  const [cards, setCards] = useState(1)
  const [open, setOpen] = useState(false)
  return (
    <>
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>Create new deck</h2>
          <Button color="green" size="small">
            Done
          </Button>
        </header>
      </Segment>
      <main>
        <Card fluid>
          <Card.Header textAlign="right">
            <Settings
              id="dummy2"
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
              onSave={_.noop}
            />
          </Card.Header>
          <Card.Content>
            {/* TODO refactor edit deck info and this form into one component */}
            <List>
              <List.Item>
                <Input placeholder="Enter name here" className="w-full"></Input>
              </List.Item>
              <List.Item>
                <Input
                  placeholder="Enter description here"
                  className="w-full"
                />
              </List.Item>
            </List>
          </Card.Content>
        </Card>
        <section className="flex-column w-inherit">
          <List>
            {_.map(_.range(cards), (_, index) => (
              <List.Item key={index}>
                <Segment>
                  <QuestionForm
                    content=""
                    answers={[createAnswer({ content: '' })]}
                    onSubmitForm={() => console.log('test')}
                    onCancel={() => console.log('cancel')}
                  />
                </Segment>
              </List.Item>
            ))}
          </List>
        </section>
      </main>
      <Segment basic style={styles.p0} className="flex-row-reverse">
        <Button icon color="green" onClick={() => setCards(cards + 1)}>
          <Icon name="plus" />
        </Button>
      </Segment>
    </>
  )
}
