/** @format */

import _ from 'lodash'
import { useEffect, useState } from 'react'
import { MutationStatus } from 'react-query'
import { Message, MessageHeader, Segment } from 'semantic-ui-react'
import {
  CardForm,
  SPButton,
  SPButtonIcon,
  SPInput,
  SPSection,
} from 'src/components'
import { styles } from 'src/styles'
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

const isValidCard = (card: FormCard, answers: Answer[]) => {
  const isValidQuestion = card.question.trim() !== ''
  const areValidAnswers = answers.every(
    (answer) => answer.content.trim() !== '',
  )

  return isValidQuestion && areValidAnswers
}
const isValidForm = (state: DeckFormState) => {
  const isValidName = state.name.trim() !== ''
  const areValidCards = getCards(state).every((card) =>
    isValidCard(card, getAnswersByCardId(state, card.id!!)),
  )

  return isValidName && areValidCards
}

type Props = {
  deck: Deck
  successMessage: string
  failureMessage: string
  submitStatus: MutationStatus
  onCancel?: VoidFunction
  onSubmit: (deck: any) => void
}

export default function DeckForm(props: Props) {
  const [localState, localDispatch] = useDeckFormReducer(props.deck)
  const [displayValidationError, setDisplayValidationError] = useState(false)
  const [displaySubmissionStatus, setDisplaySubmissionStatus] = useState(false)

  useEffect(() => {
    setDeck(localDispatch, props.deck)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.deck])

  const isUpdating = displaySubmissionStatus && props.submitStatus === 'loading'

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

  const renderMessage = () => {
    switch (props.submitStatus) {
      case 'idle':
      case 'loading':
        return null
      case 'success': {
        return (
          <Message positive data-testid="deck-submission-success">
            <MessageHeader>{props.successMessage}</MessageHeader>
          </Message>
        )
      }
      case 'error': {
        return (
          <Message negative data-testid="deck-submission-failure">
            <MessageHeader>{props.failureMessage}</MessageHeader>
          </Message>
        )
      }
    }
  }

  return (
    <>
      {displayValidationError && (
        <Message negative data-testid="deck-submission-error">
          <MessageHeader>Invalid input detected</MessageHeader>
          <p>Enter valid input and try again</p>
        </Message>
      )}
      {displaySubmissionStatus && renderMessage()}
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

        <SPSection title="Description">
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
              key={card.id!}
              answers={getAnswersByCardId(localState, card.id!!)}
              areAnswersVisible={true}
              onAddAnswer={() => handleAddAnswer(card.id!)}
              onChangeAnswer={(id: string, content: string) =>
                handleChangeAnswer(id, card.id!, content)
              }
              onChangeQuestion={(question: string) =>
                handleChangeQuestion(card.id!, question)
              }
              onDeleteAnswer={(id: string) => handleDeleteAnswer(id, card.id!)}
            />
          ))}
          <Segment basic style={styles.p0} className="flex-row-reverse">
            <SPButtonIcon color="green" icon="plus" onClick={handleAddCard} />
          </Segment>
        </SPSection>
      </div>
      <footer className="flex-row-reverse pb-2r">
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
              answers: getAnswersByCardId(localState, card.id!),
            }))

            const deckToUpdate = {
              id: props.deck.id,
              name: localState.name,
              description: localState.description,
              cards: cardsForm,
            }

            props.onSubmit(deckToUpdate)
            setDisplaySubmissionStatus(true)
          }}
        >
          Save
        </SPButton>
      </footer>
    </>
  )
}
