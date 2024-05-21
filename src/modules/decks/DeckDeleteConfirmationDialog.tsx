import _ from 'lodash'
import { useEffect, useState } from 'react'
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDeckStatus, deleteDeck] = useDeleteDeck()

  useEffect(() => {
    if (!props.open) {
      return
    }
    setIsDialogOpen(props.open)
  }, [props.open])

  const handleCancel = () => {
    setIsDialogOpen(false)
  }
  const handleConfirm = _.noop

  return (
    <SPModal data-testid="deck-delete-confirmation-dialog" open={isDialogOpen}>
      <SPModalContent>
        {async.match(deleteDeckStatus)({
          Untriggered: () => null,
          Loading: () => null,
          Success: () => null,
          Failure: () => <Message data-testid="deck-delete-error"></Message>,
        })}
        <div>Delete</div>
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
