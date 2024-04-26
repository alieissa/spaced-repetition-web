/** @format */

import { ChangeEvent, useState } from 'react'
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
} from 'semantic-ui-react'
import FileSelector from 'src/components/FileSelector'

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
  const [file, setFile] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.item(0)?.name)
  }

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
        <ModalDescription style={{ paddingBottom: 10 }}>
          <p>Select file the file containing the decks</p>
        </ModalDescription>
        <div style={{ paddingBottom: 10 }}>{file}</div>
        <FileSelector onFileSelected={handleFileSelected} />
      </ModalContent>
      <ModalActions>
        <Button color="black" disabled={isUploading} onClick={props.onClose}>
          Cancel
        </Button>
        <Button disabled={!file} onClick={() => setIsUploading(true)}>
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  )
}
