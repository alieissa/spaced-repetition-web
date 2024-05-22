import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from 'src/components'
import { async } from 'src/utils'
import { useDeleteDeck } from './decks.hooks'

type Props = {
  name: string
  open: boolean
  onCancel: VoidFunction
  onClose: VoidFunction
}
export default function DeckDeleteConfirmationDialog(props: Props) {
  const params = useParams()
  const [deleteStatus, deleteDeck] = useDeleteDeck(params.deckId!)

  useEffect(() => {
    if (deleteStatus.type !== 'Success') {
      return
    }

    // Same behaviour as close
    props.onClose()
  }, [deleteStatus.type])

  const handleConfirm = deleteDeck

  return (
    <SPModal
      data-testid="deck-delete-confirmation-dialog"
      size="tiny"
      open={props.open}
      onClose={props.onClose}
    >
      <SPModalHeader>Delete Deck</SPModalHeader>
      {async.match(deleteStatus)({
        Untriggered: () => null,
        Loading: () => null,
        Success: () => null,
        Failure: () => (
          <SPModalContent>
            <Message data-testid="deck-delete-error" />
          </SPModalContent>
        ),
      })}

      <SPModalContent style={{ alignText: 'center' }}>
        Are you sure you want to delete {props.name}?
      </SPModalContent>
      <SPModalActions>
        <SPButton onClick={props.onCancel}>Cancel</SPButton>
        <SPButton data-testid="deck-delete-confirm-btn" onClick={handleConfirm}>
          Confirm
        </SPButton>
      </SPModalActions>
    </SPModal>
  )
}
