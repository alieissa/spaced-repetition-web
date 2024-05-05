/** @format */

import * as _ from 'lodash'
import { useEffect, useReducer, useState } from 'react'
import { RouteProps, useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Card,
  Icon,
  Input,
  List,
  Message,
  MessageHeader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import { NAnswers } from 'src/modules/answers'
import { CardForm, NCards } from 'src/modules/cards'
import { styles } from 'src/styles'
import { useCreateDeck } from './decks.hooks'
import { NDecks } from './decks.types'

type State = Omit<NDecks.Initial, 'cards'> & {
  cards: _.Dictionary<NCards.Initial>
}
type Action =
  | {
      type: 'ADD_CARD'
    }
  | {
      type: 'DELETE_CARD'
      card: NCards.Initial
    }
  | {
      type: 'UPDATE_CARD'
      card: NCards.Initial
    }
  | {
      type: 'UPDATE_DECK'
      name: NDecks.Initial['name']
      description: NDecks.Initial['description']
    }

const getInitState = () => {
  const deck = NDecks.Initial({})
  return {
    ...deck,
    cards: _.keyBy(deck.cards, '__key__'),
  }
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'ADD_CARD': {
      const newCard = NCards.Initial({})
      return {
        ...state,
        cards: {
          ...state.cards,
          [newCard.id]: newCard,
        },
      }
    }
    case 'DELETE_CARD': {
      return {
        ...state,
        cards: _.omit(state.cards, action.card.id),
      }
    }
    case 'UPDATE_CARD': {
      return {
        ...state,
        cards: _.set(state.cards, action.card.id, action.card),
      }
    }
    case 'UPDATE_DECK': {
      return {
        ...state,
        name: _.trim(action.name),
        description: _.trim(action.description),
      }
    }
    default:
      return state
  }
}

const isValidAnswer = (answer: State['cards'][number]['answers'][number]) => {
  return _.trim(answer.content) !== ''
}
const isValidCard = (card: State['cards'][number]) => {
  const isValidQuestion = _.trim(card.question) !== ''
  const areValidAnswers = _.every(card.answers, isValidAnswer)

  return isValidQuestion && areValidAnswers
}
const isValidForm = (state: State) => {
  const isValidName = _.trim(state.name) != ''
  const areValidCards = _.every(_.values(state.cards), isValidCard)

  return isValidName && areValidCards
}

export default function NewDeck(props: RouteProps) {
  const navigate = useNavigate()

  const [status, createDeck] = useCreateDeck()
  const [localState, localDispatch] = useReducer(reducer, getInitState())
  const [displayValidationError, setDisplayValidationError] = useState(false)

  useEffect(() => {
    if (status.type !== 'Loading') {
      setDisplayValidationError(false)
    }
  }, [status.type])

  return (
    <>
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>Create new deck</h2>
          <div>
            <Button
              className="mx-auto"
              size="small"
              onClick={() => {
                navigate(-1)
              }}
            >
              Cancel
            </Button>
            <Button
              data-testid="deck-save"
              color="green"
              size="small"
              disabled={displayValidationError}
              onClick={() => {
                if (!isValidForm(localState)) {
                  setDisplayValidationError(true)
                  return
                }

                createDeck({
                  description: localState.description,
                  name: localState.name,
                  cards: _.values(localState.cards),
                })
              }}
            >
              Done
            </Button>
          </div>
        </header>
      </Segment>
      <main>
        {displayValidationError && (
          <Message negative data-testid="deck-submission-error">
            <MessageHeader>Invalid input detected</MessageHeader>
            <p>Enter valid input and try again</p>
          </Message>
        )}
        {status.type === 'Success' && (
          <Message positive data-testid="deck-submission-success">
            <MessageHeader>Deck successfully created</MessageHeader>
            <p>Click here to go to decks page</p>
          </Message>
        )}
        {status.type === 'Failure' && (
          <Message negative data-testid="deck-submission-failure">
            <MessageHeader>There was an error creating the deck</MessageHeader>
          </Message>
        )}
        <Card fluid>
          <Card.Header textAlign="right"></Card.Header>
          <Card.Content className="bt-none">
            <List>
              <List.Item>
                <Input
                  data-testid="deck-name"
                  placeholder="Enter name here"
                  className="w-full"
                  onChange={(e) => {
                    localDispatch({
                      type: 'UPDATE_DECK',
                      name: e.target.value,
                      description: localState.description,
                    })
                  }}
                />
              </List.Item>
              <List.Item>
                <Input
                  data-testid="deck-description"
                  placeholder="Enter description here"
                  className="w-full"
                  onChange={(e) => {
                    localDispatch({
                      type: 'UPDATE_DECK',
                      name: localState.name,
                      description: e.target.value,
                    })
                  }}
                />
              </List.Item>
            </List>
          </Card.Content>
        </Card>
        <section className="flex-column w-inherit">
          <List>
            {_.map(_.values(localState.cards), (q, index) => (
              <List.Item key={q.id}>
                <Segment>
                  <CardForm
                    {...q}
                    id={q.id}
                    onAddAnswer={() => {
                      localDispatch({
                        type: 'UPDATE_CARD',
                        card: {
                          ...q,
                          answers: [...q.answers, NAnswers.Initial({})],
                        },
                      })
                    }}
                    onChangeAnswer={(answer, newAnswerContent) => {
                      localDispatch({
                        type: 'UPDATE_CARD',
                        card: {
                          ...q,
                          answers: _.map(q.answers, (a) => {
                            if (a.id === answer) {
                              return { ...a, content: newAnswerContent }
                            } else {
                              return a
                            }
                          }),
                        },
                      })
                    }}
                    onChangeQuestion={(question) => {
                      localDispatch({
                        type: 'UPDATE_CARD',
                        card: { ...q, question },
                      })
                    }}
                    onDeleteAnswer={(answer) => {
                      localDispatch({
                        type: 'UPDATE_CARD',
                        card: {
                          ...q,
                          answers: _.filter(q.answers, (a) => a.id !== answer),
                        },
                      })
                    }}
                  />
                </Segment>
              </List.Item>
            ))}
          </List>
        </section>
      </main>
      <Segment basic style={styles.p0} className="flex-row-reverse">
        <Button
          icon
          color="green"
          onClick={() => {
            localDispatch({
              type: 'ADD_CARD',
            })
          }}
        >
          <Icon name="plus" />
        </Button>
      </Segment>
    </>
  )
}
