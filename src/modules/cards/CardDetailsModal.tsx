/** @format */

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  SPButton,
  SPModal,
  SPModalContent,
  SPModalHeader,
} from 'src/components'
import { useCardDetails } from './cards.hooks'
import { NCards } from './cards.types'

/**
 * This component contains the create card modal and the button that is used to toggle
 * the modal.
 */
export default function CardDetailsModal() {
  const params = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loadCardStatus, card, loadCard] = useCardDetails(
    params.deckId!,
    params.cardId!,
  )

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    navigate(`/decks/${params.deckId}`)
  }

  useEffect(() => {
    loadCard()
  }, [params.cardId])

  useEffect(() => {
    if (loadCardStatus.type !== 'Success') {
      return
    }

    setIsModalOpen(true)
  }, [loadCardStatus.type])

  return (
    <>
      <SPModal
        data-testid="card-details-modal"
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        {isEditing ? (
          <CardDetailsForm {...card} />
        ) : (
          <CardDetailsView {...card} onEdit={() => setIsEditing(true)} />
        )}
      </SPModal>
    </>
  )
}

type ViewProps = NCards.Card & { onEdit: VoidFunction }
function CardDetailsView(props: ViewProps) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  return (
    <>
      <SPModalHeader>
        <div>
          Card Details
          <SPButton data-testid="card-details-edit-btn" onClick={props.onEdit}>
            Edit
          </SPButton>
        </div>
      </SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        <div>{props.question}</div>
        <SPButton
          data-testid="view-answers-btn"
          onClick={() => setAreAnswersVisible(!areAnswersVisible)}
        />
        {areAnswersVisible &&
          props.answers.map((answer, index) => {
            return <div data-testid={`answers-${index}`}>{answer.content}</div>
          })}
      </SPModalContent>
    </>
  )
}

function CardDetailsForm(props: NCards.Card) {
  return (
    <>
      <SPModalHeader data-testid="card-details-form">
        <div>Edit Card</div>
      </SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        <div>{props?.question}</div>
      </SPModalContent>
    </>
  )
}
