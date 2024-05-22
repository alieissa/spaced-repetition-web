/** @format */

import { ButtonProps, Popup } from 'semantic-ui-react'
import { SPButton } from '.'
import './components.css'

export default function DownloadButton(props: ButtonProps) {
  return (
    <Popup
      content="Download decks"
      size="mini"
      trigger={<SPButton className="download-btn" icon="download" {...props} />}
    />
  )
}
