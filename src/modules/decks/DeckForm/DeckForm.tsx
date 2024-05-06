/** @format */

import _ from 'lodash'
import { useState } from 'react'
import {
  Button,
  Card,
  Container,
  Icon,
  Input,
  List,
  Message,
  MessageHeader,
  Segment,
} from 'semantic-ui-react'
import { CardForm } from 'src/components'
import { NAnswers } from 'src/modules/answers'
import { styles } from 'src/styles'
import { RequestError } from 'src/types'
import { async } from 'src/utils'
import { NDecks } from '../decks.types'
import {
  addAnswer,
  addCard,
  changeAnswer,
  changeDeck,
  changeQuestion,
  deleteAnswer,
} from './deckForm.actions'
import { DeckFormState, FormCard, useDeckFormReducer } from './deckForm.reducer'
import { getAnswersByCardId, getCards } from './deckForm.selectors'

const isValidAnswer = (answer: NAnswers.Answer) => {
  return _.trim(answer.content) !== ''
}
const isValidCard = (state: DeckFormState, card: FormCard) => {
  const isValidQuestion = _.trim(card.question) !== ''
  const areValidAnswers = _.every(
    getAnswersByCardId(state, card.id),
    isValidAnswer,
  )

  return isValidQuestion && areValidAnswers
}
const isValidForm = (state: DeckFormState) => {
  const isValidName = _.trim(state.name) != ''
  const areValidCards = _.every(getCards(state), (card) =>
    isValidCard(state, card),
  )

  return isValidName && areValidCards
}

type Props = {
  header: string
  deck: NDecks.Deck
  submitStatus: async.Async<null, RequestError, null>
  onCancel: VoidFunction
  onSubmit: (deck: any) => void
}

export default function DeckForm(props: Props) {
  const [localState, localDispatch] = useDeckFormReducer(props.deck)
  const [displayValidationError, setDisplayValidationError] = useState(false)
  console.log(localState)
  const isUpdating = props.submitStatus.type === 'Loading'

  const handleChangeDeckName = (e: any) => {
    changeDeck(localDispatch, {
      name: e.target.value,
      description: localState.description,
    })
  }

  const handleDeckDescriptionChange = (e: any) => {
    changeDeck(localDispatch, {
      name: localState.name,
      description: e.target.value,
    })
  }

  const handleAddAnswer = (cardId: string) => {
    addAnswer(localDispatch, { cardId })
  }

  const handleDeleteAnswer = (id: string, cardId: string) => {
    deleteAnswer(localDispatch, { id, cardId })
  }

  const handleChangeAnswer = (
    id: string,
    cardId: string,
    newAnswerContent: string,
  ) => {
    console.log(cardId)
    changeAnswer(localDispatch, {
      id,
      cardId,
      content: newAnswerContent,
    })
  }

  const handleChangeQuestion = (cardId: string, question: string) => {
    changeQuestion(localDispatch, { cardId, question })
  }

  const handleAddCard = () => {
    addCard(localDispatch)
  }

  return (
    <Container data-testid="deck-success">
      <Segment basic style={styles.p0}>
        <header className="justify-space-between">
          <h2>{props.header}</h2>
          <div>
            <Button
              className="mx-auto"
              size="small"
              disabled={isUpdating}
              onClick={props.onCancel}
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
                  cards: getCards(localState),
                }

                props.onSubmit(deckToUpdate)
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
        {props.submitStatus.type === 'Success' && (
          <Message positive data-testid="deck-submission-success">
            <MessageHeader>Deck successfully updated</MessageHeader>
          </Message>
        )}
        {props.submitStatus.type === 'Failure' && (
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
                    onChange={handleChangeDeckName}
                  />
                </List.Item>
                <List.Item>
                  <Input
                    data-testid="deck-description"
                    placeholder="Enter description here"
                    className="w-full"
                    value={localState.description}
                    onChange={handleDeckDescriptionChange}
                  />
                </List.Item>
              </List>
            </Card.Content>
          </Card>
          <section className="flex-column w-inherit test">
            <List>
              {_.map(getCards(localState), (card) => (
                <List.Item key={card.id}>
                  <Segment className="bs-0">
                    <CardForm
                      {...card}
                      answers={getAnswersByCardId(localState, card.id)}
                      onAddAnswer={() => handleAddAnswer(card.id)}
                      onChangeAnswer={(id, content) =>
                        handleChangeAnswer(id, card.id, content)
                      }
                      onChangeQuestion={(question: string) =>
                        handleChangeQuestion(card.id, question)
                      }
                      onDeleteAnswer={(id: string) =>
                        handleDeleteAnswer(id, card.id)
                      }
                    />
                  </Segment>
                </List.Item>
              ))}
            </List>
          </section>
          <Segment basic style={styles.p0} className="flex-row-reverse test">
            <Button icon color="green" onClick={handleAddCard}>
              <Icon name="plus" />
            </Button>
          </Segment>
        </div>
      </main>
    </Container>
  )
}