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
import { CardForm } from 'src/modules/cards'
import { styles } from 'src/styles'
import * as Select from './decks.selectors'

import { useSelector } from 'react-redux'
import { async } from 'src/utils'
import { Answers } from '../answers'
import { DeckFormState, useDeckById, useDeckFormReducer } from './decks.hooks'
import { NDecks } from './decks.types'

const isValidAnswer = (
  answer: DeckFormState['cards'][number]['answers'][number],
) => {
  return _.trim(answer.content) !== ''
}
const isValidCard = (card: DeckFormState['cards'][number]) => {
  const isValidQuestion = _.trim(card.question) !== ''
  const areValidAnswers = _.every(card.answers, isValidAnswer)

  return isValidQuestion && areValidAnswers
}
const isValidForm = (state: DeckFormState) => {
  const isValidName = _.trim(state.name) != ''
  const areValidCards = _.every(_.values(state.cards), isValidCard)

  return isValidName && areValidCards
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

  const isUpdating = updateStatus.type === 'Loading'

  return (
    <Container data-testid="deck-success">
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>Update deck</h2>
          <div>
            <Button
              className="mx-auto"
              size="small"
              disabled={isUpdating}
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
              disabled={!isValidForm(localState) || isUpdating}
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
                  questions: _.values(localState.cards),
                } as unknown as NDecks.Deck

                props.updateDeck(deckToUpdate)
              }}
            >
              Save
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
        )}{' '}
        <div>
          <Card fluid>
            <Card.Content style={styles.p0} className="bt-none">
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
          <section className="flex-column w-inherit test">
            <List>
              {_.map(_.values(localState.cards), (q, index) => (
                <List.Item key={q.__key__}>
                  <Segment className="bs-0">
                    <CardForm
                      {...q}
                      id={index}
                      onAddAnswer={() => {
                        localDispatch({
                          type: 'UPDATE_CARD',
                          card: {
                            ...q,
                            answers: [...q.answers, Answers.Initial({})],
                          },
                        })
                      }}
                      onChangeAnswer={(answer, newAnswerContent) => {
                        localDispatch({
                          type: 'UPDATE_CARD',
                          card: {
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
          <Segment basic style={styles.p0} className="flex-row-reverse test">
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
        </div>
      </main>
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
