/** @format */

import _ from 'lodash'
import { useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Card, Container, Loader, Segment } from 'semantic-ui-react'
import 'src/App.css'
import { DeckInfo } from 'src/components'
import { TestCard } from 'src/modules/cards'
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
  return (
    <Container className="w-max-xl">
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
      {/* TODO display one by one */}
      {_.map(props.deck.cards, (card) => {
        return <TestCard {...card} deckId={props.deck.id} />
      })}
    </Container>
  )
}

export default function DeckTest() {
  const params = useParams<{ deckId: string }>()
  const [status, deck, __] = useDeckById(params.deckId!)

  return async.match(status)({
    Untriggered: () => null,
    Loading: () => (
      <Segment data-testid="deck-loading">
        <Loader active />
      </Segment>
    ),
    Success: () => <DeckTestPage deck={deck} />,
    Failure: () => {
      return <Segment data-testid="deck-failure" />
    },
  })
}
