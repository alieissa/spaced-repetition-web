/** @format */

import { ChangeEvent, useEffect, useState } from 'react'
import { Message } from 'semantic-ui-react'
import 'src/App.css'
import FileSelector from 'src/components/FileSelector'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from '../../components'
import { useUploadDecksMutation } from './decks.hooks'
/**
 * This component contains the modal and the button that is used to toggle
 * the modal.
 */
export default function DecksUploadModal(props: { onClose: VoidFunction }) {
  const [file, setFile] = useState<File | null>()
  const uploadDecksMutation = useUploadDecksMutation()

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0])
  }

  const handleFileUpload = () => {
    uploadDecksMutation.mutate(file!)
  }

  useEffect(() => {
    if (uploadDecksMutation.status === 'success') {
      props.onClose()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadDecksMutation.status])

  const renderErrorMessage = () => {
    return (
      <Message negative className="w-inherit" data-testid="decks-upload-error">
        <Message.Header>Upload failed</Message.Header>
        <p>Please try again.</p>
      </Message>
    )
  }
  return (
    <>
      <SPModal
        dimmer="inverted"
        size="tiny"
        open={true}
        data-testid="decks-upload-modal"
        onClose={props.onClose}
      >
        <SPModalHeader>Upload Decks</SPModalHeader>
        <SPModalContent className="flex-column align-center justify-center">
          {uploadDecksMutation.status === 'error' && renderErrorMessage()}
          <SPModalContent className="pb-10">
            <p>Select file the file containing the decks</p>
          </SPModalContent>
          <div className="pb-10">{file?.name}</div>
          <FileSelector
            data-testid="decks-upload-file-input"
            onFileSelected={handleFileSelected}
          />
        </SPModalContent>
        <SPModalActions>
          <SPButton
            disabled={uploadDecksMutation.status === 'loading'}
            onClick={props.onClose}
          >
            Cancel
          </SPButton>
          <SPButton
            data-testid="decks-upload-confirm-btn"
            color="green"
            disabled={!file}
            onClick={handleFileUpload}
          >
            Confirm
          </SPButton>
        </SPModalActions>
      </SPModal>
    </>
  )
}
