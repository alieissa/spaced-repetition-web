/** @format */

import { Outlet, useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownProps,
  Icon,
  Message,
  MessageHeader,
} from 'semantic-ui-react'
import 'src/App.css'
import { async } from 'src/utils'

import {
  SPButton,
  SPCard,
  SPCardContent,
  SPList,
  SPListItem,
  SPSection,
  SPSectionHeader,
} from 'src/components'

import _ from 'lodash'
import { useEffect } from 'react'
import { useDeckById } from './decks.hooks'

/**
 * This component displays the details of a deck, including cards of the deck.
 * When a user clicks on a card a modal with the card details is opened.
 */
export default function DeckDetails() {
  const navigate = useNavigate()
  const params = useParams<{ deckId: string }>()
  const { status: loadDeckStatus, deck, loadDeck } = useDeckById(params.deckId!)

  useEffect(() => {
    loadDeck()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.deckId])

  const handleEdit = () => navigate(`/decks/${params.deckId}/edit`)

  const handleTest = () => navigate(`/decks/${params.deckId}/test`)
  // TODO implement delete deck functionality
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
            <SPSectionHeader
              style={{ borderBottom: '1px solid' }}
              title={deck.name}
              actions={
                <>
                  <SPButton data-testid="deck-test-btn" onClick={handleTest}>
                    Test
                  </SPButton>
                  <SPButton data-testid="deck-edit-btn" onClick={handleEdit}>
                    Edit
                  </SPButton>
                  <DeckMenu onDelete={handleDelete} />
                </>
              }
            />
            <main className="px-2r mb-2r">
              {deck.description && (
                <SPSection title="Description">
                  <span
                    data-testid="deck-details-description"
                    className="w-full"
                  >
                    {deck.description}
                  </span>
                </SPSection>
              )}
              <SPSection title="Cards">
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
              </SPSection>
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
}
function DeckMenu(props: MenuProps) {
  return (
    <Dropdown
      data-testid="deck-details-dropdown"
      className="align-center"
      style={{ display: 'inline-flex', alignItems: 'center' }}
      icon={<Icon name="ellipsis vertical" style={{ height: '100%' }} />}
    >
      <DropdownMenu data-testid="deck-details-dropdown-menu" direction="left">
        <DropdownItem text="Test" onClick={props.onTest} />
      </DropdownMenu>
    </Dropdown>
  )
}
