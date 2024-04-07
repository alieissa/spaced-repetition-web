/** @format */

import { useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Card,
  Container,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import { DeckInfo } from 'src/components'
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
  const [state, dispatch] = useCardTestFormReducer(props.deck.cards)

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
    <Container className="w-max-xl" data-testid="deck-test-success">
      <Card fluid style={styles.boxShadowNone}>
        <Card.Content
          className="justify-space-between relative"
          style={{ ...styles['px-0'], ...styles['pt-0'] }}
        >
          <DeckInfo
            id="dummyId2"
            name="Deck 2"
            description="Dummy deck description"
            cards={props.deck.cards}
          />
        </Card.Content>
      </Card>

      <TestCard
        {...currentCard}
        deckId={props.deck.id}
        onChange={handleAnswerChange}
      >
        {state.cards.length > 1 && (
          <>
            <Button
              icon
              data-testid="next-card-btn"
              disabled={isLastCard}
              onClick={handleNext}
            >
              <Icon name="arrow right" />
            </Button>
            <Button
              icon
              data-testid="previous-card-btn"
              disabled={isFirstCard}
              onClick={handlePrevious}
            >
              <Icon name="arrow left" />
            </Button>
          </>
        )}
      </TestCard>
    </Container>
  )
}

export default function DeckTest() {
  const params = useParams<{ deckId: string }>()
  const [status, _deck, _updateDeck] = useDeckById(params.deckId!)

  return async.match(status)({
    Untriggered: () => null,
    Loading: () => (
      <Segment data-testid="deck-test-loading">
        <Loader active />
      </Segment>
    ),
    Success: ({ value }) => <DeckTestPage deck={value} />,
    Failure: () => {
      return <Segment data-testid="deck-test-failure" />
    },
  })
}
