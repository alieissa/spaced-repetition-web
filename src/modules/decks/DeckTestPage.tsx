/** @format */

import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react'
import 'src/App.css'
import { SPButtonIcon, SPHeader } from 'src/components'
import { TestCard, useCardTestFormReducer } from 'src/modules/cards'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import { useDeckById } from './decks.hooks'
import { NDecks } from './decks.types'
/**
 * Displays a series of questions that user must answer. User update settings of a question and
 * record an incorrect answer as a correct one
 */
type Props = {
  deck: NDecks.Deck
}
export function DeckTestPage(props: Props) {
  const navigate = useNavigate()
  const [state, dispatch] = useCardTestFormReducer(props.deck.cards)

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleAnswerChange = (id: string, userAnswer: string) => {
    dispatch({
      type: 'UPDATE_USER_ANSWER',
      id,
      userAnswer,
    })
  }

  const handleNext = () => {
    dispatch({
      type: 'GET_NEXT_CARD',
    })
  }

  const handlePrevious = () => {
    dispatch({
      type: 'GET_PREVIOUS_CARD',
    })
  }

  const currentCard = state.cards[state.currentCardIndex]
  const isLastCard = state.currentCardIndex === props.deck.cards.length - 1
  const isFirstCard = state.currentCardIndex === 0

  return (
    <div className="w-max-xl" data-testid="deck-test-success">
      <div className="align-center" style={styles.p0}>
        <SPButtonIcon
          size="huge"
          icon="chevron left"
          onClick={handleBackClick}
        />
        <SPHeader as="h2" className="flex">
          {props.deck.name}
        </SPHeader>
      </div>

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
  const [status, _deck, _updateDeck] = useDeckById(params.deckId!)

  return async.match(status)({
    Untriggered: () => null,
    Loading: () => null,
    Success: ({ value }) => <DeckTestPage deck={value} />,
    Failure: () => (
      <Message data-testid="deck-test-failure" negative className="w-inherit">
        <Message.Header>
          Error: Unable to retrieve deck information
        </Message.Header>
      </Message>
    ),
  })
}
