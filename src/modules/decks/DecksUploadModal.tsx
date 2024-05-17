/** @format */

import { ChangeEvent, useEffect, useState } from 'react'
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
import 'src/App.css'
import FileSelector from 'src/components/FileSelector'
import { async } from 'src/utils'
import { ImportButton } from '../../components'
import { useUploadDecks } from './decks.hooks'
/**
 * This component contains the modal and the button that is used to toggle
 * the modal.
 */
export default function UploadDecksModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>()
  const [uploadDecksStatus, uploadDecks, resetUploadDecks] = useUploadDecks()
  const isUploading = uploadDecksStatus.type === 'Loading'

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0])
  }

  const handleFileUpload = () => {
    uploadDecks(file!)
  }

  const handleCloseModal = () => {
    setFile(null)
    resetUploadDecks()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (uploadDecksStatus.type === 'Success') {
      handleCloseModal()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadDecksStatus.type])

  return (
    <>
      <ImportButton
        data-testid="decks-upload-modal-btn"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        dimmer="inverted"
        size="tiny"
        open={isModalOpen}
        data-testid="decks-upload-modal"
        onClose={handleCloseModal}
      >
        <ModalHeader>Upload decks</ModalHeader>
        <ModalContent className="flex-column align-center justify-center">
          {async.match(uploadDecksStatus)({
            Untriggered: () => null,
            Loading: () => <Loader active data-testid="decks-upload-loader" />,
            Success: () => null,
            Failure: () => (
              <Message
                negative
                className="w-inherit"
                data-testid="decks-upload-error"
              >
                <Message.Header>Upload failed</Message.Header>
                <p>Please try again.</p>
              </Message>
            ),
          })}

          <ModalDescription className="pb-10">
            <p>Select file the file containing the decks</p>
          </ModalDescription>
          <div className="pb-10">{file?.name}</div>
          <FileSelector
            data-testid="decks-upload-file-input"
            onFileSelected={handleFileSelected}
          />
        </ModalContent>
        <ModalActions>
          <Button disabled={isUploading} onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            data-testid="decks-upload-confirm-btn"
            color="green"
            disabled={!file}
            onClick={handleFileUpload}
          >
            Confirm
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}
