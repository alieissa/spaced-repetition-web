/** @format */

import { ButtonProps } from 'semantic-ui-react'
import { SPTooltip } from '.'
import SPButton from './Button'
import './components.css'

export default function UploadButton(props: ButtonProps) {
  return (
    <SPTooltip content="Upload decks" size="mini">
      <SPButton className="upload-btn" icon="upload" {...props} />
    </SPTooltip>
  )
}
