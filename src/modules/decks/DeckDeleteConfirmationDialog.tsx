import { MutationStatus } from 'react-query'
import { Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from 'src/components'

type Props = {
  name: string
  open: boolean
  status: MutationStatus
  onCancel: VoidFunction
  onClose: VoidFunction
  onConfirm: VoidFunction
}
export default function DeckDeleteConfirmationDialog(props: Props) {
  return (
    <SPModal
      data-testid="deck-delete-confirmation-dialog"
      size="tiny"
      open={props.open}
      onClose={props.onClose}
    >
      <SPModalHeader>Delete Deck</SPModalHeader>
      {props.status === 'error' && (
        <SPModalContent>
          <Message data-testid="deck-delete-error" />
        </SPModalContent>
      )}

      <SPModalContent>
        Are you sure you want to delete {props.name}?
      </SPModalContent>
      <SPModalActions>
        <SPButton onClick={props.onCancel}>Cancel</SPButton>
        <SPButton
          data-testid="deck-delete-confirm-btn"
          color="red"
          onClick={props.onConfirm}
        >
          Confirm
        </SPButton>
      </SPModalActions>
    </SPModal>
  )
}
