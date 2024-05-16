/** @format */

import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Message, MessageHeader, Segment } from 'semantic-ui-react'
import {
  CardForm,
  SPButton,
  SPButtonIcon,
  SPInput,
  SPSection,
  SPSectionHeader,
} from 'src/components'
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
  setDeck,
} from './deckForm.actions'
import { DeckFormState, FormCard, useDeckFormReducer } from './deckForm.reducer'
import { getAnswersByCardId, getCards } from './deckForm.selectors'

const isValidCard = (card: FormCard, answers: NAnswers.Answer[]) => {
  const isValidQuestion = card.question.trim() !== ''
  const areValidAnswers = answers.every(
    (answer) => answer.content.trim() !== '',
  )

  return isValidQuestion && areValidAnswers
}
const isValidForm = (state: DeckFormState) => {
  const isValidName = state.name.trim() != ''
  const areValidCards = getCards(state).every((card) =>
    isValidCard(card, getAnswersByCardId(state, card.id)),
  )

  return isValidName && areValidCards
}

type Props = {
  header: string
  deck: NDecks.Deck
  successMessage: string
  failureMessage: string
  submitStatus: async.Async<null, RequestError, null>
  onCancel?: VoidFunction
  onSubmit: (deck: any) => void
}

export default function DeckForm(props: Props) {
  const [localState, localDispatch] = useDeckFormReducer(props.deck)
  const [displayValidationError, setDisplayValidationError] = useState(false)

  useEffect(() => {
    setDeck(localDispatch, props.deck)
  }, [props.deck])

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
    <div data-testid="deck-success" className="bordered">
      <SPSectionHeader
        title={props.header}
        navIcon={
          <SPButtonIcon
            size="huge"
            icon="chevron left"
            onClick={props.onCancel}
          />
        }
        className="bordered"
      />
      <main className="px-2r">
        {displayValidationError && (
          <Message negative data-testid="deck-submission-error">
            <MessageHeader>Invalid input detected</MessageHeader>
            <p>Enter valid input and try again</p>
          </Message>
        )}
        {async.match(props.submitStatus)({
          Untriggered: () => null,
          Loading: () => null,
          Success: () => (
            <Message positive data-testid="deck-submission-success">
              <MessageHeader>{props.successMessage}</MessageHeader>
            </Message>
          ),
          Failure: () => (
            <Message negative data-testid="deck-submission-failure">
              <MessageHeader>{props.failureMessage}</MessageHeader>
            </Message>
          ),
        })}
        <div>
          <div>
            <SPInput
              data-testid="deck-name"
              size="huge"
              placeholder="Enter name here"
              className="w-full"
              value={localState.name}
              style={{ fontWeight: 400, paddingLeft: 0 }}
              onChange={handleChangeDeckName}
            />
          </div>

          <SPSection data-testid="deck-description" title="Description">
            <textarea
              data-testid="deck-description"
              rows={5}
              className="w-full"
              name="deck-textarea"
              value={localState.description}
              onChange={handleDeckDescriptionChange}
            />
          </SPSection>
          <SPSection title="Cards">
            {_.map(getCards(localState), (card) => (
              <CardForm
                {...card}
                key={card.id}
                answers={getAnswersByCardId(localState, card.id)}
                onAddAnswer={() => handleAddAnswer(card.id)}
                onChangeAnswer={(id, content) =>
                  handleChangeAnswer(id, card.id, content)
                }
                onChangeQuestion={(question: string) =>
                  handleChangeQuestion(card.id, question)
                }
                onDeleteAnswer={(id: string) => handleDeleteAnswer(id, card.id)}
              />
            ))}
            <Segment basic style={styles.p0} className="flex-row-reverse">
              <SPButtonIcon color="green" icon="plus" onClick={handleAddCard} />
            </Segment>
          </SPSection>
        </div>
      </main>
      <footer className="flex-row-reverse px-2r pb-2r">
        <SPButton
          data-testid="deck-save"
          color="green"
          size="small"
          disabled={isUpdating}
          onClick={() => {
            if (!isValidForm(localState)) {
              setDisplayValidationError(true)
              return
            }
            const cards = getCards(localState)
            const cardsForm = cards.map((card) => ({
              ...card,
              answers: getAnswersByCardId(localState, card.id),
            }))

            const deckToUpdate = {
              id: props.deck.id,
              name: localState.name,
              description: localState.description,
              cards: cardsForm,
            }

            props.onSubmit(deckToUpdate)
          }}
        >
          Save
        </SPButton>
      </footer>
    </div>
  )
}
