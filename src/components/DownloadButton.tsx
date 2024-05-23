/** @format */

import { ButtonProps } from 'semantic-ui-react'
import { SPButton, SPTooltip } from '.'
import './components.css'

export default function DownloadButton(props: ButtonProps) {
  return (
    <SPTooltip content="Download decks" size="mini">
      <SPButton className="download-btn" icon="download" {...props} />
    </SPTooltip>
  )
}
