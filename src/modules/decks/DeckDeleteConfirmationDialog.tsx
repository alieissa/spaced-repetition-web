import { useEffect } from 'react'
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
      open={props.open}
      onClose={props.onClose}
    >
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
        <SPButton onClick={props.onCancel}>Cancel</SPButton>
      </SPModalActions>
    </SPModal>
  )
}
