/** @format */

import { ButtonProps } from 'semantic-ui-react'
import { SPButton } from '.'
import './components.css'

export default function ExportButton(props: ButtonProps) {
  return (
    <SPButton size="small" className="export-btn" icon="download" {...props} />
  )
}
