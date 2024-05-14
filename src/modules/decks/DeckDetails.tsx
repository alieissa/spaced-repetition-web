/** @format */

import { Outlet, useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownProps,
  Message,
  MessageHeader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import { async } from 'src/utils'

import {
  SPButton,
  SPCard,
  SPCardContent,
  SPList,
  SPListItem,
} from 'src/components'

import _ from 'lodash'
import { useEffect } from 'react'
import { styles } from 'src/styles'
import { useDeckById } from './decks.hooks'

/**
 * This component displays the details of a deck, including cards of the deck.
 * When a user clicks on a card a modal with the card details is opened.
 */
export default function DeckDetails() {
  const navigate = useNavigate()
  const params = useParams<{ deckId: string }>()
  const [loadDeckStatus, deck, loadDeck] = useDeckById(params.deckId!)

  useEffect(() => {
    loadDeck()
  }, [params.deckId])

  const handleEdit = () => navigate(`/decks/${params.deckId}/edit`)

  const handleTest = () => navigate(`/decks/${params.deckId}/test`)
  const handleDelete = _.noop

  const handleCardClick = (cardId: string) =>
    navigate(`/decks/${params.deckId}/cards/${cardId}`)

  const handleAddCard = _.noop

  return async.match(loadDeckStatus)({
    Untriggered: () => null,
    Loading: () => null,
    Success: () => {
      return (
        <>
          {/* The components of the children routes /decks/:deckId/cards/:cardId
              and /decks/:deckId/cards/new are opened here, i.e. the card details 
              and card create modals are opened here
          */}
          <Outlet />
          <div data-testid="deck-details-success">
            <Segment basic style={styles.p0}>
              <header className="justify-space-between">
                <h2>{deck.name}</h2>
                <div>
                  <SPButton data-testid="deck-edit-btn" onClick={handleEdit}>
                    Edit
                  </SPButton>
                  <DeckMenu onDelete={handleDelete} onTest={handleTest} />
                </div>
              </header>
            </Segment>
            <main>
              <div>
                {deck.description && (
                  <>
                    <div style={{ display: 'flex' }}>
                      <span style={{ fontWeight: 600 }}>Description</span>
                    </div>
                    <span
                      data-testid="deck-details-description"
                      className="w-full"
                    >
                      {deck.description}
                    </span>
                  </>
                )}
                <section className="flex-column w-inherit test">
                  <div>
                    <span style={{ fontWeight: 600 }}>Cards</span>
                  </div>
                  <SPList horizontal celled divided={false}>
                    {deck.cards.map((card, index) => (
                      <SPListItem key={card.id}>
                        <SPCard
                          data-testid={`deck-details-card-${index}`}
                          className="pointer"
                          as="div"
                          onClick={() => handleCardClick(card.id)}
                        >
                          <SPCardContent>{card.question}</SPCardContent>
                        </SPCard>
                      </SPListItem>
                    ))}
                    <SPListItem>
                      <SPCard
                        as="div"
                        className="pointer"
                        onClick={handleAddCard}
                      >
                        <SPCardContent>Add card</SPCardContent>
                      </SPCard>
                    </SPListItem>
                  </SPList>
                </section>
              </div>
            </main>
          </div>
        </>
      )
    },
    Failure: () => {
      return (
        <Message negative data-testid="deck-details-failure">
          <MessageHeader>Error: Unable to load deck details</MessageHeader>
        </Message>
      )
    },
  })
}

type MenuProps = DropdownProps & {
  onDelete: VoidFunction
  onTest: VoidFunction
}
function DeckMenu(props: MenuProps) {
  return (
    <Dropdown data-testid="deck-details-dropdown" icon="ellipsis vertical">
      <DropdownMenu data-testid="deck-details-dropdown-menu">
        <DropdownItem text="Test" onClick={props.onTest} />
        <DropdownItem text="Delete" onClick={props.onDelete} />
      </DropdownMenu>
    </Dropdown>
  )
}
