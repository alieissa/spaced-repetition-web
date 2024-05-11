/** @format */

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, List, ListItem } from 'semantic-ui-react'
import 'src/App.css'
import {
  SPButton,
  SPModal,
  SPModalContent,
  SPModalHeader,
  SPText,
} from 'src/components'
import { styles } from 'src/styles'
import { useCardDetails } from './cards.hooks'
import { NCards } from './cards.types'

/**
 * This component contains the card details modal. The modal displays the
 * details of a card and an edit form when user clicks on edit.
 *
 * The modal is not controlled by any parent component, it is displayed when
 * the route /decks/:deckId/cards/:cardId is hit and it controls its state
 * completely
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
        <div className="justify-space-between">
          <span>Card Details</span>
          <SPButton data-testid="card-details-edit-btn" onClick={props.onEdit}>
            Edit
          </SPButton>
        </div>
      </SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        <div className="flex-row-reverse">
          <Icon
            data-testid="view-answers-btn"
            name={!areAnswersVisible ? 'arrow down' : 'arrow up'}
            onClick={() => setAreAnswersVisible(!areAnswersVisible)}
          />
        </div>
        <List
          horizontal
          className="w-full"
          style={{ ...styles.flex, marginTop: '1rem' }}
        >
          <ListItem className="flex-1">
            <SPText className="w-full" value={props.question} />
          </ListItem>
          <ListItem className="flex-1">
            <List style={styles.p0}>
              {areAnswersVisible &&
                props.answers.map((answer, index) => {
                  return (
                    <ListItem key={answer.id} data-testid={`answers-${index}`}>
                      <SPText className="w-full" value={answer.content} />
                    </ListItem>
                  )
                })}
            </List>
          </ListItem>
        </List>
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
