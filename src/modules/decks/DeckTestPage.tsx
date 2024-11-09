/** @format */

import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react'
import 'src/App.css'
import { SPButtonIcon, SPSectionHeader } from 'src/components'
import { TestCard, useCardTestFormReducer } from 'src/modules/cards'
import { useDeckByIdQuery } from './decks.hooks'
/**
 * Displays a series of questions that user must answer. User update settings of a question and
 * record an incorrect answer as a correct one
 */
type Props = {
  deck: Deck
}
export function DeckTestPage(props: Props) {
  const navigate = useNavigate()
  const [state, dispatch] = useCardTestFormReducer(props.deck.cards)

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleAnswerChange = (id: string, userAnswer: string) => {
    dispatch({
      type: 'UpdateUserAnswer',
      id,
      userAnswer,
    })
  }

  const handleNext = () => {
    dispatch({
      type: 'GetNextCard',
    })
  }

  const handlePrevious = () => {
    dispatch({
      type: 'GetPreviousCard',
    })
  }

  const currentCard = state.cards[state.currentCardIndex]
  const isLastCard = state.currentCardIndex === props.deck.cards.length - 1
  const isFirstCard = state.currentCardIndex === 0

  return (
    <div data-testid="deck-test-success">
      <SPSectionHeader
        title={props.deck.name}
        navIcon={
          <SPButtonIcon
            size="huge"
            icon="chevron left"
            onClick={handleBackClick}
          />
        }
      ></SPSectionHeader>

      <TestCard
        {...currentCard}
        deckId={props.deck.id}
        onChange={handleAnswerChange}
      >
        {state.cards.length > 1 && (
          <>
            <SPButtonIcon
              data-testid="next-card-btn"
              icon="arrow right"
              disabled={isLastCard}
              onClick={handleNext}
            />
            <SPButtonIcon
              data-testid="previous-card-btn"
              icon="arrow left"
              disabled={isFirstCard}
              onClick={handlePrevious}
            />
          </>
        )}
      </TestCard>
    </div>
  )
}

export default function DeckTest() {
  const params = useParams<{ deckId: string }>()
  const { status, data } = useDeckByIdQuery(params.deckId!)

  switch (status) {
    case 'idle':
    case 'loading':
      return null
    case 'success': {
      const deck = data.data
      return <DeckTestPage deck={deck} />
    }
    case 'error': {
      return (
        <Message data-testid="deck-test-failure" negative className="w-inherit">
          <Message.Header>
            Error: Unable to retrieve deck information
          </Message.Header>
        </Message>
      )
    }
  }
}
