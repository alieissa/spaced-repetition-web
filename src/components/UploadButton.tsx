/** @format */

import { ButtonProps, Popup } from 'semantic-ui-react'
import SPButton from './Button'
import './components.css'

export default function UploadButton(props: ButtonProps) {
  return (
    <Popup
      content="Upload decks"
      open={true}
      size="mini"
      trigger={<SPButton className="upload-btn" icon="upload" {...props} />}
    />
  )
}
