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
  }, [uploadDecksStatus.type])

  return (
    <>
      <ImportButton
        data-testid="decks-upload-modal-btn"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        dimmer="inverted"
        open={isModalOpen}
        data-testid="decks-upload-modal"
        onClose={handleCloseModal}
      >
        <ModalHeader>Upload decks</ModalHeader>
        <ModalContent
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {async.match(uploadDecksStatus)({
            Untriggered: () => null,
            Loading: () => <Loader active data-testid="decks-upload-loader" />,
            Success: () => null,
            Failure: () => (
              <Message
                negative
                data-testid="decks-upload-error"
                style={{ width: 'inherit' }}
              >
                <Message.Header>Upload failed</Message.Header>
                <p>Please try again.</p>
              </Message>
            ),
          })}

          <ModalDescription style={{ paddingBottom: 10 }}>
            <p>Select file the file containing the decks</p>
          </ModalDescription>
          <div style={{ paddingBottom: 10 }}>{file?.name}</div>
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
