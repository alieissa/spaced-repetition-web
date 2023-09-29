/** @format */

import * as _ from 'lodash'
import { MouseEventHandler, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import 'src/App.css'
import { DeckInfo } from 'src/components'
import {
  Question,
  Questions,
  SubmittableQuestionForm,
} from 'src/modules/questions'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import { deckById, deckByIdStatus } from './decks.selectors'
import { Decks } from './decks.types'

/**
 * Displays the deck information and a list of cards (questions) that belong to deck. User can
 * perform CRUD operation on individual cards (questions) and/or on entire deck
 */
export function DeckPageComponent(props: Decks.Deck) {
  const [editing, setEditing] = useState(false)
  const [newQuestions, setNewQuestions] = useState<
    ReadonlyArray<Questions.Initial>
  >([])
  return (
    <Container className="w-max-xl">
      <Card fluid style={styles.boxShadowNone}>
        <Card.Content
          className="justify-space-between relative"
          style={{ ...styles['px-0'], ...styles['pt-0'] }}
        >
          {editing ? (
            <DeckEditInfoForm
              deck={props}
              onCancel={() => setEditing(false)}
              onSubmitForm={({
                name,
                description,
              }: Pick<Decks.Deck, 'name' | 'description'>) => console.log(name)}
            />
          ) : (
            <DeckInfo
              id={props.id}
              name={props.name}
              description={props.description}
              questions={[]}
              onEdit={() => setEditing(true)}
              onSubmitSettings={() => console.log('submit settings')}
            />
          )}
        </Card.Content>
      </Card>
      <List>
        {_.map(props.questions, (q) => {
          return (
            <List.Item key={q.id}>
              <Question {...q} />
            </List.Item>
          )
        })}
        {_.map(newQuestions, (nq) => {
          return (
            <List.Item key={nq.__key__} width={16}>
              <Segment>
                <SubmittableQuestionForm
                  {...nq}
                  id={nq.__key__}
                  onSubmit={(question) => console.log('question')}
                  onCancel={() =>
                    setNewQuestions(
                      _.filter(
                        newQuestions,
                        ({ __key__ }) => nq.__key__ !== __key__,
                      ),
                    )
                  }
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
          onClick={() =>
            setNewQuestions([...newQuestions, Questions.Initial({})])
          }
        />
      </Segment>
    </Container>
  )
}

export default function DeckPage(props: RouteProps & { deckId: string }) {
  const [deck, status] = useDeckById(props.deckId)

  return async.match(status)({
    Untriggered: () => <div>Loading</div>,
    Loading: () => <div>Loading</div>,
    Failure: (failure) => <div>Failure</div>,
    Success: () => {
      return <DeckPageComponent {...deck} />
    },
  })
}

type DeckEditInfoFormProps = {
  readonly deck: Decks.Deck
  readonly onCancel: MouseEventHandler
  readonly onSubmitForm: (deck: Decks.Deck) => void
}
/**
 * User can change name and description of a deck using this component
 */
function DeckEditInfoForm(props: DeckEditInfoFormProps) {
  const [deck, setDeck] = useState({ ...props.deck })
  return (
    <>
      <Form onSubmit={() => props.onSubmitForm(deck)} className="w-full">
        <Form.Input
          label="Name"
          defaultValue={props.deck.name}
          value={deck.name}
          onChange={(e) => setDeck({ ...deck, name: e.target.value })}
        />
        <Form.TextArea
          label="Description"
          value={deck.description}
          defaultValue={props.deck.description}
          onChange={(e) => setDeck({ ...deck, description: e.target.value })}
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

function useDeckById(
  id: Decks.Deck['id'],
): [Decks.Deck, async.Async<null, Error, null>] {
  const deck = useSelector(deckById(id))
  const status = useSelector(deckByIdStatus(id))
  const dispatch = useDispatch()
  const getDeck = useAuthRequest({ url: `decks/${id}`, method: 'GET' })

  useEffect(() => {
    if (deck) {
      return
    }

    dispatch({
      type: 'GetDeck',
      id,
    })
    getDeck().then((result: any) => {
      dispatch({ type: 'DeckLoaded', result, id })
    })
  }, [])

  return [deck, status]
}
