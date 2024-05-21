import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
} from 'src/components'
import { async } from 'src/utils'
import { useDeleteDeck } from './decks.hooks'

type Props = {
  open: boolean
}
export default function DeckDeleteConfirmationDialog(props: Props) {
  const params = useParams()
  const [deleteStatus, deleteDeck] = useDeleteDeck(params.deckId!)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!props.open) {
      return
    }
    setIsDialogOpen(props.open)
  }, [props.open])

  useEffect(() => {
    if (deleteStatus.type !== 'Success') {
      return
    }

    setIsDialogOpen(false)
  }, [deleteStatus.type])

  const handleCancel = () => {
    setIsDialogOpen(false)
  }
  const handleConfirm = deleteDeck

  return (
    <SPModal data-testid="deck-delete-confirmation-dialog" open={isDialogOpen}>
      <SPModalContent>
        {async.match(deleteStatus)({
          Untriggered: () => null,
          Loading: () => null,
          Success: () => null,
          Failure: () => <Message data-testid="deck-delete-error"></Message>,
        })}
      </SPModalContent>
      <SPModalActions>
        <SPButton data-testid="deck-delete-confirm-btn" onClick={handleConfirm}>
          Confirm
        </SPButton>
        <SPButton onClick={handleCancel}>Cancel</SPButton>
      </SPModalActions>
    </SPModal>
  )
}
