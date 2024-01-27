/** @format */

import * as _ from 'lodash'
import { useReducer } from 'react'
import { RouteProps, useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Icon, Input, List, Segment } from 'semantic-ui-react'
import 'src/App.css'
import { Answers } from 'src/modules/answers'
import { useAuthRequest } from 'src/modules/auth/auth.hooks'
import { QuestionForm, Questions } from 'src/modules/questions'
import { styles } from 'src/styles'
import { NDecks } from './decks.types'
// Save questions in a dictionary to make it easier to work with
// in reducer
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
      return { ...state, name: action.name, description: action.description }
    }
    default:
      return state
  }
}

export default function NewDeck(props: RouteProps) {
  const navigate = useNavigate()
  const createDeck = useAuthRequest<NDecks.PostRequest>({
    url: 'decks',
    method: 'POST',
  })

  const [state, localDispatch] = useReducer(reducer, getInitState())

  return (
    <>
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>Create new deck</h2>
          <Button
            size="small"
            onClick={() => {
              navigate(-1)
            }}
          >
            Cancel
          </Button>
          <Button
            color="green"
            size="small"
            onClick={() => {
              createDeck(
                NDecks.toPostRequest({
                  ...state,
                  questions: _.values(state.questions),
                }),
              )
            }}
          >
            Done
          </Button>
        </header>
      </Segment>
      <main>
        <Card fluid>
          <Card.Header textAlign="right"></Card.Header>
          <Card.Content>
            <List>
              <List.Item>
                <Input
                  placeholder="Enter name here"
                  className="w-full"
                  onChange={(e) => {
                    localDispatch({
                      type: 'UPDATE_DECK',
                      name: e.target.value,
                      description: state.description,
                    })
                  }}
                ></Input>
              </List.Item>
              <List.Item>
                <Input
                  placeholder="Enter description here"
                  className="w-full"
                  onChange={(e) => {
                    localDispatch({
                      type: 'UPDATE_DECK',
                      name: state.name,
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
            {_.map(_.values(state.questions), (q) => (
              <List.Item key={q.__key__}>
                <Segment>
                  <QuestionForm
                    {...q}
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
