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
import { Answers } from 'src/modules/answers'
import { QuestionForm, Questions } from 'src/modules/questions'
import { styles } from 'src/styles'
import { useCreateDeck } from './decks.hooks'
import { NDecks } from './decks.types'

type State = Omit<NDecks.Initial, 'questions'> & {
  questions: _.Dictionary<Questions.Initial>
}
type Action =
  | {
      type: 'ADD_QUESTION'
    }
  | {
      type: 'DELETE_QUESTION'
      question: Questions.Initial
    }
  | {
      type: 'UPDATE_QUESTION'
      question: Questions.Initial
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
    questions: _.keyBy(deck.questions, '__key__'),
  }
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'ADD_QUESTION': {
      const newQuestion = Questions.Initial({})
      return {
        ...state,
        questions: {
          ...state.questions,
          [newQuestion.__key__]: newQuestion,
        },
      }
    }
    case 'DELETE_QUESTION': {
      return {
        ...state,
        questions: _.omit(state.questions, action.question.__key__),
      }
    }
    case 'UPDATE_QUESTION': {
      return {
        ...state,
        questions: _.set(
          state.questions,
          action.question.__key__,
          action.question,
        ),
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

const isValidAnswer = (
  answer: State['questions'][number]['answers'][number],
) => {
  return _.trim(answer.content) !== ''
}
const isValidQuestion = (question: State['questions'][number]) => {
  const isValidContent = _.trim(question.content) !== ''
  const areValidAnswers = _.every(question.answers, isValidAnswer)

  return isValidContent && areValidAnswers
}
const isValidForm = (state: State) => {
  const isValidName = _.trim(state.name) != ''
  const areValidQuestions = _.every(_.values(state.questions), isValidQuestion)

  return isValidName && areValidQuestions
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

                // TODO use type guard to make sure data
                // is PostRequest before sending it to createDeck
                createDeck(
                  NDecks.toPostRequest({
                    description: localState.description,
                    name: localState.name,
                    questions: _.values(localState.questions),
                  }),
                )
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
            {_.map(_.values(localState.questions), (q, index) => (
              <List.Item key={q.__key__}>
                <Segment>
                  <QuestionForm
                    {...q}
                    id={index}
                    onAddAnswer={() => {
                      localDispatch({
                        type: 'UPDATE_QUESTION',
                        question: {
                          ...q,
                          answers: [...q.answers, Answers.Initial({})],
                        },
                      })
                    }}
                    onChangeAnswer={(answer, newAnswerContent) => {
                      localDispatch({
                        type: 'UPDATE_QUESTION',
                        question: {
                          ...q,
                          answers: _.map(q.answers, (a) => {
                            if (a.__key__ === answer.__key__) {
                              return { ...a, content: newAnswerContent }
                            } else {
                              return a
                            }
                          }),
                        },
                      })
                    }}
                    onChangeContent={(content) => {
                      localDispatch({
                        type: 'UPDATE_QUESTION',
                        question: { ...q, content },
                      })
                    }}
                    onDeleteAnswer={(answer) => {
                      localDispatch({
                        type: 'UPDATE_QUESTION',
                        question: {
                          ...q,
                          answers: _.filter(
                            q.answers,
                            (a) => a.__key__ !== answer.__key__,
                          ),
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
              type: 'ADD_QUESTION',
            })
          }}
        >
          <Icon name="plus" />
        </Button>
      </Segment>
    </>
  )
}
