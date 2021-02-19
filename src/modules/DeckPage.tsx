/** @format */

import { FormikConfig, useFormik } from 'formik'
import * as _ from 'lodash'
import React, { MouseEventHandler, useState } from 'react'
import { RouteProps } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Card,
  Container,
  Form,
  Icon,
  List,
  Segment,
} from 'semantic-ui-react'
import { styles } from 'src/styles'
import { Question } from '.'
import '../App.css'
import { DeckInfo, QuestionForm } from '../components'
import { createAnswer } from './helpers'

/**
 * Displays the deck information and a list of cards (questions) that belong to deck. User can
 * perform CRUD operation on individual cards (questions) and/or on entire deck
 */
export default function DeckPage(__: RouteProps) {
  const [NewQuestions, setNewQuestions] = useState(0)
  const [editing, setEditing] = useState(false)

  return (
    <Container className="w-max-xl">
      <Card fluid style={styles.boxShadowNone}>
        <Card.Content
          className="justify-space-between relative"
          style={{ ...styles['px-0'], ...styles['pt-0'] }}
        >
          {editing ? (
            <DeckEditInfoForm
              name="Deck 2"
              description="Dummy deck description"
              onCancel={() => setEditing(false)}
              onSubmitForm={(name, description) =>
                console.log(name, description)
              }
            />
          ) : (
            <DeckInfo
              id="dummyDeckId"
              name="Deck 2"
              description="Dummy deck description"
              easiness={1}
              quality={1}
              interval={1}
              questions={[]}
              onEdit={() => setEditing(true)}
              onSubmitSettings={() => console.log('submit settings')}
            />
          )}
        </Card.Content>
      </Card>
      <List>
        {_.map(_.range(0, 3), (i) => {
          return (
            <List.Item key={i}>
              <Question />
            </List.Item>
          )
        })}
        {_.map(_.range(0, NewQuestions), (i) => {
          return (
            <List.Item key={i} width={16}>
              <Segment>
                <QuestionForm
                  content=""
                  answers={[createAnswer({ content: '' })]}
                  onSubmitForm={() => console.log('submit form')}
                  onCancel={() => console.log('on cancel')}
                />
              </Segment>
            </List.Item>
          )
        })}
      </List>

      <Segment basic style={styles.p0} className="justify-flex-end">
        <Button
          color="green"
          style={styles.bgWhite}
          icon={<Icon name="plus" />}
          onClick={() => setNewQuestions(NewQuestions + 1)}
        />
      </Segment>
    </Container>
  )
}

interface DeckEditInfoFormProps {
  readonly onSubmitForm: FormikConfig<{
    name: string
    description: string
  }>['onSubmit']
  readonly onCancel: MouseEventHandler
}
/**
 * User can change name and description of a deck using this component
 */
function DeckEditInfoForm(
  props: WithDeck<DeckEditInfoFormProps, 'name' | 'description'>,
) {
  const formik = useFormik({
    initialValues: {
      description: props.description || '',
      name: props.name,
    },
    onSubmit: props.onSubmitForm,
  })
  return (
    <>
      <Form onSubmit={formik.handleSubmit} className="w-full">
        <Form.Input
          label="Name"
          defaultValue={formik.values.name}
          onChange={formik.handleChange}
        />
        <Form.TextArea
          label="Description"
          defaultValue={formik.values.description}
          onChange={formik.handleChange}
        />
        <Form.Group className="justify-flex-end">
          <Form.Button basic onClick={props.onCancel}>
            Cancel
          </Form.Button>
          <Form.Button type="submit" color="green">
            Save
          </Form.Button>
        </Form.Group>
      </Form>
    </>
  )
}
