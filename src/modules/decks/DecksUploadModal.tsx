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
import { useUploadDecks } from './decks.hooks'

type Props = {
  onClose: VoidFunction
}
/**
 * This modal is used to upload a file containing decks to the backend.
 *
 * NOTE: It only has an onClose callback because the expectation is the parent
 * component is controlling open and close states.
 */
export default function ImportButton(props: Props) {
  const [file, setFile] = useState<File | null>()
  const [uploadDecksStatus, uploadDecks, resetUploadDecks] = useUploadDecks()
  const isUploading = uploadDecksStatus.type === 'Loading'

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0])
  }

  const handleFileUpload = () => {
    uploadDecks(file!)
  }

  useEffect(() => {
    if (uploadDecksStatus.type === 'Success') {
      props.onClose()
    }
  }, [uploadDecksStatus.type])

  useEffect(() => {
    return () => resetUploadDecks()
  }, [])

  return (
    // Open is true because parent mounts it when it wants to open it
    <Modal open={true} dimmer="inverted" onClose={props.onClose}>
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
          Loading: () => <Loader active />,
          Success: () => null,
          Failure: () => (
            <Message
              negative
              style={{ width: 'inherit' }}
              data-testid="upload-error"
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
        <FileSelector onFileSelected={handleFileSelected} />
      </ModalContent>
      <ModalActions>
        <Button disabled={isUploading} onClick={props.onClose}>
          Cancel
        </Button>
        <Button color="green" disabled={!file} onClick={handleFileUpload}>
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  )
}
