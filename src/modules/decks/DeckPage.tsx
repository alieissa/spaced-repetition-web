/** @format */

import * as _ from 'lodash'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Card,
  Container,
  Icon,
  Input,
  List,
  Loader,
  Message,
  MessageHeader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import { QuestionForm } from 'src/modules/questions'
import { styles } from 'src/styles'
import * as Select from './decks.selectors'

import { useSelector } from 'react-redux'
import { async } from 'src/utils'
import { Answers } from '../answers'
import { DeckFormState, useDeckById, useDeckFormReducer } from './decks.hooks'
import { NDecks } from './decks.types'

const isValidAnswer = (
  answer: DeckFormState['questions'][number]['answers'][number],
) => {
  return _.trim(answer.content) !== ''
}
const isValidQuestion = (question: DeckFormState['questions'][number]) => {
  const isValidContent = _.trim(question.content) !== ''
  const areValidAnswers = _.every(question.answers, isValidAnswer)

  return isValidContent && areValidAnswers
}
const isValidForm = (state: DeckFormState) => {
  const isValidName = _.trim(state.name) != ''
  const areValidQuestions = _.every(_.values(state.questions), isValidQuestion)

  return isValidName && areValidQuestions
}

type Props = {
  deck: NDecks.Deck
  updateDeck: (deck: NDecks.Deck) => void
}
/**
 * Displays the deck information and a list of cards (questions) that belong to deck. User can
 * perform CRUD operation on individual cards (questions) and/or on entire deck
 */
function DeckComponent(props: Props) {
  const navigate = useNavigate()

  const updateStatus = useSelector(Select.updateStatus(props.deck.id))
  const [localState, localDispatch] = useDeckFormReducer(props.deck)
  const [displayValidationError, setDisplayValidationError] = useState(false)

  return (
    <Container data-testid="deck-success">
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>Update deck</h2>
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

                // TODO Get rid of casting once proper view and
                // DTO are defined
                const deckToUpdate = {
                  id: props.deck.id,
                  description: localState.description,
                  name: localState.name!,
                  questions: _.values(localState.questions),
                } as unknown as NDecks.Deck

                props.updateDeck(deckToUpdate)
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
        {updateStatus.type === 'Success' && (
          <Message positive data-testid="deck-submission-success">
            <MessageHeader>Deck successfully updated</MessageHeader>
          </Message>
        )}
        {updateStatus.type === 'Failure' && (
          <Message negative data-testid="deck-submission-failure">
            <MessageHeader>There was an error updating the deck</MessageHeader>
          </Message>
        )}
        {updateStatus.type === 'Loading' ? (
          <div>Loading</div>
        ) : (
          <>
            <Card fluid>
              <Card.Header textAlign="right"></Card.Header>
              <Card.Content className="bt-none">
                <List>
                  <List.Item>
                    <Input
                      data-testid="deck-name"
                      placeholder="Enter name here"
                      className="w-full"
                      value={localState.name}
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
                      value={localState.description}
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
          </>
        )}
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
    </Container>
  )
}

export default function Deck() {
  const params = useParams<{ deckId: string }>()
  const [status, deck, updateDeck] = useDeckById(params.deckId!)

  return async.match(status)({
    Untriggered: () => null,
    Loading: () => (
      <Segment data-testid="deck-loading">
        <Loader active />
      </Segment>
    ),
    Success: () => <DeckComponent deck={deck} updateDeck={updateDeck} />,
    Failure: () => {
      return <Segment data-testid="deck-failure" />
    },
  })
}
