/** @format */

import { useEffect, useState } from 'react'
import {
  Button,
  Loader,
  Message,
  Modal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
} from 'semantic-ui-react'
import { ImportButton } from 'src/components'
import { async } from 'src/utils'
import { useCardCreate } from './cards.hooks'

type Props = {
  deckId: string
}
/**
 * This component contains the modal and the button that is used to toggle
 * the modal.
 */
export default function CardCreateModal(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [createCardStatus, resetUploadDecks] = useUploadDecks()
  const [createCardStatus, createCard] = useCardCreate(props.deckId)
  console.log(createCardStatus)
  const isUploading = createCardStatus.type === 'Loading'

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCardCreate = () => {
    console.log('clicked handle create')
    createCard()
  }

  useEffect(() => {
    if (createCardStatus.type === 'Success') {
      handleCloseModal()
    }
  }, [createCardStatus.type])

  return (
    <>
      <ImportButton
        data-testid="card-create-modal-btn"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        dimmer="inverted"
        size="tiny"
        open={isModalOpen}
        data-testid="card-create-modal"
        onClose={handleCloseModal}
      >
        <ModalHeader>Create Card</ModalHeader>
        <ModalContent className="flex-column align-center justify-center">
          {async.match(createCardStatus)({
            Untriggered: () => null,
            Loading: () => <Loader active data-testid="card-create-loader" />,
            Success: () => null,
            Failure: () => (
              <Message
                negative
                className="w-inherit"
                data-testid="card-create-error"
              >
                <Message.Header>Card creation failed</Message.Header>
              </Message>
            ),
          })}

          <ModalDescription className="pb-10">
            <p>Select file the file containing the decks</p>
          </ModalDescription>
        </ModalContent>
        <ModalActions>
          <Button disabled={isUploading} onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            data-testid="card-create-save-btn"
            color="green"
            onClick={handleCardCreate}
          >
            Save
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}
