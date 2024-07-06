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

import clsx from 'clsx'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { styles } from 'src/styles'
import DeckDeleteConfirmationDialog from './DeckDeleteConfirmationDialog'
import { useDeckById } from './decks.hooks'
import { NDecks } from './decks.types'

type MenuProps = DropdownProps & {
  onDelete: VoidFunction
}
function DeckMenu(props: MenuProps) {
  return (
    <Dropdown
      data-testid="deck-details-dropdown"
      className="align-center"
      style={{ ...styles.inlineFlex, ...styles.alignCenter }}
      icon={<Icon name="ellipsis vertical" style={styles.hFull} />}
    >
      <DropdownMenu data-testid="deck-details-dropdown-menu" direction="left">
        <DropdownItem
          data-testid="deck-menu-delete-option"
          style={styles.colorRed}
          text="Delete"
          color="red"
          onClick={props.onDelete}
        />
      </DropdownMenu>
    </Dropdown>
  )
}

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
function DeckDetails(props: { deckId: string }) {
  const navigate = useNavigate()
  const { status: loadDeckStatus, deck } = useDeckById(props.deckId)
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState(false)

  const handleEdit = () => navigate(`/decks/${props.deckId}/edit`)

  const handleTest = () => navigate(`/decks/${props.deckId}/test`)

  const handleDelete = () => setIsDeleteConfirmationDialogOpen(true)
  const handleCancelDelete = () => setIsDeleteConfirmationDialogOpen(false)

  const handleClickCard = (cardId: string) =>
    navigate(`/decks/${props.deckId}/cards/${cardId}`)

  const handleAddCard = () => navigate(`/decks/${props.deckId}/cards/new`)
  console.log('load status', loadDeckStatus)
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
          <DeckDeleteConfirmationDialog
            name={deck.name}
            open={isDeleteConfirmationDialogOpen}
            onCancel={handleCancelDelete}
            onClose={handleCancelDelete}
          />
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

export default function Test12() {
  const decks = useSelector(Select.decks)
  const params = useParams<{ deckId: string }>()
  if (decks.length === 0) {
    return null
  }

  return <DeckDetails deckId={params.deckId!} />
}
