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
import {
  SPButton,
  SPCard,
  SPCardContent,
  SPList,
  SPListItem,
  SPSection,
  SPSectionHeader,
} from 'src/components'
import { async } from 'src/utils'
import * as Select from './decks.selectors'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeckDeleteConfirmationDialog from './DeckDeleteConfirmationDialog'
import { useDeckById } from './decks.hooks'
import { NDecks } from './decks.types'

type DeckDetailsProps = NDecks.Deck & {
  onAddCard: VoidFunction
  onClickCard: (id: string) => void
  onDelete: VoidFunction
  onEdit: VoidFunction
  onTest: VoidFunction
}
function DeckDetailsComponent(props: DeckDetailsProps) {
  const deleteStatus = useSelector(Select.deleteStatus(props.id))
  const isDisabled = deleteStatus.type === 'Success'

  return (
    <div className={clsx('h-full', { 'not-allowed-cursor': isDisabled })}>
      <div
        data-testid="deck-details-success"
        className={clsx({ disabled: isDisabled })}
      >
        <SPSectionHeader
          style={{ borderBottom: '1px solid' }}
          title={props.name}
          actions={
            <>
              <SPButton data-testid="deck-test-btn" onClick={props.onTest}>
                Test
              </SPButton>
              <SPButton data-testid="deck-edit-btn" onClick={props.onEdit}>
                Edit
              </SPButton>
              <DeckMenu onDelete={props.onDelete} />
            </>
          }
        />
        <main className="px-2r mb-2r">
          {props.description && (
            <SPSection title="Description">
              <span data-testid="deck-details-description" className="w-full">
                {props.description}
              </span>
            </SPSection>
          )}
          <SPSection title="Cards">
            <SPList horizontal celled divided={false}>
              {props.cards.map((card, index) => (
                <SPListItem key={card.id}>
                  <SPCard
                    data-testid={`deck-details-card-${index}`}
                    className="pointer"
                    as="div"
                    onClick={() => props.onClickCard(card.id)}
                  >
                    <SPCardContent>{card.question}</SPCardContent>
                  </SPCard>
                </SPListItem>
              ))}
              <SPListItem>
                <SPCard as="div" className="pointer" onClick={props.onAddCard}>
                  <SPCardContent>Add card</SPCardContent>
                </SPCard>
              </SPListItem>
            </SPList>
          </SPSection>
        </main>
      </div>
    </div>
  )
}
/**
 * This component displays the details of a deck, including cards of the deck.
 * When a user clicks on a card a modal with the card details is opened.
 */
export default function DeckDetails() {
  const navigate = useNavigate()
  const params = useParams<{ deckId: string }>()
  const { status: loadDeckStatus, deck, loadDeck } = useDeckById(params.deckId!)
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState(false)

  useEffect(() => {
    loadDeck()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.deckId])

  const handleEdit = () => navigate(`/decks/${params.deckId}/edit`)

  const handleTest = () => navigate(`/decks/${params.deckId}/test`)

  const handleDelete = () => {
    setIsDeleteConfirmationDialogOpen(true)
  }

  const handleClickCard = (cardId: string) =>
    navigate(`/decks/${params.deckId}/cards/${cardId}`)

  const handleAddCard = () => navigate(`/decks/${params.deckId}/cards/new`)

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
          <DeckDeleteConfirmationDialog open={isDeleteConfirmationDialogOpen} />
          {/* <div style={{ cursor: 'not-allowed', opacity: '0.5' }}>
            <div
              data-testid="deck-details-success"
              style={{ pointerEvents: 'none' }}
            >
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
          </div> */}
          <DeckDetailsComponent
            {...deck}
            onAddCard={handleAddCard}
            onClickCard={handleClickCard}
            onEdit={handleEdit}
            onTest={handleTest}
            onDelete={handleDelete}
          />
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
        <DropdownItem
          data-testid="deck-menu-delete-option"
          text="Delete"
          onClick={props.onDelete}
        />
      </DropdownMenu>
    </Dropdown>
  )
}
